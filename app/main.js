document.addEventListener("DOMContentLoaded", function(){
  Unword.Tick.run();
  
  Unword.Storage.readAll('vocabularies', function(list){
    if(list.length > 0){
      return;
    }
    Unword.Storage.add('vocabularies', Unword.Models.Vocabulary.new({
      name: "Your fist questions",
      is_active: 1
    }), function(id){
      Unword.Storage.add('questions', Unword.Models.Question.new({
        vocabulary_id: id,
        question: "How many days in a week",
        question_explain: "Regular week",
        answer: '7',
        answer_explain: "Week have 7 days"
      }));
      Unword.Storage.add('questions', Unword.Models.Question.new({
        vocabulary_id: id,
        question: "What is the main 'question of Universe' anwser",
        question_explain: "The Hitchhiker's Guide to the Galaxy",
        answer: '42',
        answer_explain: "Just 42 do not ask anything ..."
      }));
    });
  });
}, false);
