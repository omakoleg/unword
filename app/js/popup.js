var Unword = Unword || {};

Unword.Popup = (function () {
  var module = {
    question: null,
    accept_answer: true
  };
  module.init = function(){
    module.tabQuestions(); // default tab
    module.attachQuestionHandlers();    
    // set focus
    setTimeout(function(){
      $("#question-answer").focus();
    }, 300);
    
    $(".func-settings").on('click', function(){
      chrome.tabs.create({'url': chrome.extension.getURL('html/background.html')});
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
        $("#answer").removeClass('hidden');
        if(module.question.answer_explain){
          $("#answer-explain").removeClass('hidden');
        }
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
    $("#question-answer").val('');
    $("#question,#question-explain, #answer, #answer-explain").addClass('hidden');
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
            $("#question-text").html(module.question.question +' ?');
            $("#answer").html(module.question.answer);
            if(module.question.question_explain){
              $("#question-explain").removeClass('hidden').html(module.question.question_explain);
            }
            if(module.question.answer_explain){
              $("#answer-explain").html(module.question.answer_explain);
            }
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
