var Unword = Unword || {};

Unword.Popup = (function () {
  var module = {
    question: null,
    accept_answer: true
  };
  module.init = function(){
    module.tabQuestions(); // default tab
    module.attachQuestionHandlers();    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      var tab = $(e.target).attr('aria-controls');
      if(tab == 'home'){
        module.tabQuestions();
      } else if(tab == 'vocabularies'){
        module.tabVocabularies();
      } else {
        //settings tab
      }
    });
    // set focus
    setTimeout(function(){
      $("#question-answer").focus();
    }, 300);
  }  
  
  module.vocabularyTemplate = function(data){
    return $("<li class='list-group-item' data-id='"+ data.id + "'> \
      <button class='btn btn-xs btn-danger func-remove'>remove</button>\
      <span class='badge'>" + data.count + "</span> \
      <button class=\"btn btn-xs btn-default func-download\">download</button> \
      <button class='btn btn-xs func-activate " + data.active_class +"'>" + data.active_label +"</button> \
      " + data.name + " \
    </li>");
  }
  module.tabVocabularies = function(){
    // should be lazy loaded
    $(".tmpl-holder").html("");
    $(".func-add-vocabulary").on('click', function(){
      chrome.tabs.create({'url': chrome.extension.getURL('assets/html/background.html') });
    });
    Unword.Storage.readAll('vocabularies', function(list){
      $.each(list, function(i, elem){
        var dfd = $.Deferred().done(function(cnt){
          var data = {
            id: elem.id,
            name: elem.name,
            count: cnt,
            active_label: elem.is_active ? 'active' : 'activate',
            active_class: elem.is_active ? 'btn-info' : ''
          };
          var tmpl = module.vocabularyTemplate(data);
          tmpl.find(".func-activate").on('click', function(e){
            module.toggleVocabulary($(e.target).parent().data('id'));
          });
          tmpl.find(".func-download").on('click', function(e){
            Unword.Files.downloadVocabulary($(e.target).parent().data('id'));
          });
          tmpl.find(".func-remove").on('click', function(e){
            $(e.target).attr('disabled','disabled');
            $(e.target).html('wait ...');
            Unword.Models.Vocabulary.deleteRecursive($(e.target).parent().data('id'), function(){
              module.tabVocabularies();
            });
          });
          $(".tmpl-holder").append(tmpl);
        });
        Unword.Storage.count('questions', { index: { name: 'vocabulary_id', value: elem.id }}, function(cnt){
          dfd.resolve(cnt);
        });
      });
    });
  }
  module.toggleVocabulary = function(id){
    Unword.Storage.get('vocabularies', id, function(data){
      data.is_active = data.is_active ? 0 : 1;
      Unword.Storage.update('vocabularies', data, function(){
        module.tabVocabularies();
        // Unword.Badge.update();
      });
    });
  }
  
  module.attachQuestionHandlers = function(){
    $("#question-answer").on('keydown', function(e){
      var keycode = (e.keyCode ? e.keyCode : e.which);
      if(keycode == '13'){
        e.preventDefault();
        module.submitQuestion();
      }
    });
  }
  
  module.updateCounters = function(is_answered, callback){
    var cb = function(){ if(callback){ callback(); }}
    if(!module.question.count_answers) { module.question.count_answers = 0; }
    module.question.count_answers += is_answered ? 1 : -1;
    //remove question
    if(module.question.count_answers >= 10) {
      module.question.is_completed = 1;
    }
    // co not move below zero
    if(module.question.count_answers < 0){
      module.question.count_answers = 0;
    }
    Unword.Storage.update('questions', module.question, cb); 
  }
    
  module.submitQuestion = function(){
    if(module.accept_answer){
      
      var answer = $("#question-answer").val();
      // show message or load next
      if(answer != module.question.answer){
        module.accept_answer = false;
        $(".answer-elements").removeClass('hidden');
        $("#answer").html(module.question.answer);
        $("#answer-explain").html(module.question.answer_explain);
        module.updateCounters(false);
      } else{
        module.updateCounters(true, function(){
          module.tabQuestions();
        });
      }
    } else {
      // load next
      module.tabQuestions();
    }
  }
  
  module.tabQuestions = function(){
    // clean answer
    // turn accept
    // hide message
    $("#question-answer").val('');
    $(".answer-elements").addClass('hidden').val('');
    module.accept_answer = true;
    // search for random question in random active vocabulary
    Unword.Models.Vocabulary.getRandomActive(function(vocabulary){
      if(vocabulary){
        $(".questions-container").removeClass('hidden');
        $(".no-vocabularies").addClass('hidden');
        $(".vocabulary-name").html(vocabulary.name);
        Unword.Models.Question.getActiveByVocabularyId(vocabulary.id, function(questions){
          $(".count-all").html(questions.length);
          if(questions.length == 0){
            console.log('no questions in vocabulary'); 
          } else {
            module.question = Unword.Util.arrayRandom(questions);
            $("#question-text").html(module.question.question);
            $("#question-explain").html(module.question.question_explain);
            $(".count-answers").html(module.question.count_answers);
          }
        });
      } else {
        $(".questions-container").addClass('hidden');
        $(".no-vocabularies").removeClass('hidden');
      }
    });
  }
  return module;
}());
