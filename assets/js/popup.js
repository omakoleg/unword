var Unword = Unword || {};

Unword.Popup = (function () {
  var module = {
    word: null,
    accept_answer: true
  };
  module.init = function(){
    module.tabWords(); // default tab
    module.attachWordHandlers();    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      var tab = $(e.target).attr('aria-controls');
      if(tab == 'home'){
        module.tabWords();
      } else if(tab == 'vocabularies'){
        module.tabVocabularies();
      } else {
        //settings tab
      }
    });
  }  
  
  module.vocabularyTemplate = function(data){
    return $("<li class='list-group-item'> \
      <a href='#' class='btn btn-xs btn-danger'>remove</a>\
      <span class='badge'>" + data.count + "</span> \
      <button data-id='"+ data.id + "' \
        class='btn btn-xs " + data.active_class +"'>" + data.active_label +"</button> \
      " + data.name + " \
    </li>");
  }
  module.tabVocabularies = function(){
    // should be lazy loaded
    $(".tmpl-holder").html("");
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
          tmpl.find("button").on('click', function(e){
            module.toggleVocabulary($(e.target).data('id'));
          });
          $(".tmpl-holder").append(tmpl);
        });
        Unword.Storage.count('words', { index: { name: 'vocabulary_id', value: elem.id }}, function(cnt){
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
        Unword.Badge.update();
      });
    });
  }
  
  module.attachWordHandlers = function(){
    $("#word-answer").on('keydown', function(e){
      var keycode = (e.keyCode ? e.keyCode : e.which);
      if(keycode == '13'){
        e.preventDefault();
        module.submitWord();
      }
    });
    $("#word-submit").on('click', function(e){
      e.preventDefault();
      module.submitWord();
    });
  }
  
  module.updateCounters = function(is_answered, callback){
    var cb = function(){ if(callback){ callback(); }}
    if(!module.word.count_answers) { module.word.count_answers = 0; }
    module.word.count_answers += is_answered ? 1 : -1;
    console.log(module.word.count_answers);
    //remove word
    if(module.word.count_answers >= 10) {
      module.word.is_completed = 1;
    }
    // co not move below zero
    if(module.word.count_answers < 0){
      module.word.count_answers = 0;
    }
    Unword.Storage.update('words', module.word, cb); 
  }
    
  module.submitWord = function(){
    if(module.accept_answer){
      
      var answer = $("#word-answer").val();
      console.log(answer);
      console.log(module.word.translation);
      // show message or load next
      if(answer != module.word.translation){
        module.accept_answer = false;
        var text = $("<strong>")
        text.html("  (" + module.word.translation + ")");
        $("#word-text").append(text);
        module.updateCounters(false);
      } else{
        module.updateCounters(true, function(){
          module.tabWords();
        });
      }
    } else {
      // load next
      module.tabWords();
    }
  }
  
  module.tabWords = function(){
    // clean answer
    // turn accept
    // hide message
    $("#word-answer").val('');
    module.accept_answer = true;
    // search for random word in random active vocabulary
    Unword.Models.Vocabulary.getRandomActive(function(vocabulary){
      if(vocabulary){
        $(".words-container").removeClass('hidden');
        $(".no-vocabularies").addClass('hidden');
        $(".vocabulary-name").html(vocabulary.name);
        Unword.Models.Word.getActiveByVocabularyId(vocabulary.id, function(words){
          $(".count-all").html(words.length);
          if(words.length == 0){
            console.log('no words in vocabulary'); 
          } else {
            module.word = Unword.Util.arrayRandom(words);
            $("#word-text").html(module.word.text);
            $("#word-example").html(module.word.example);
            $(".count-answers").html(module.word.count_answers);
          }
        });
      } else {
        $(".words-container").addClass('hidden');
        $(".no-vocabularies").removeClass('hidden');
      }
    });
  }
  return module;
}());

$(function(){
  Unword.Popup.init();
  setTimeout(function(){
    $("#word-answer").focus();
  }, 300);
});
