// chrome.contextMenus.create({
//   title: 'Memorize',
//   id: 'unword-context',
//   contexts: ['selection'],
// });
// 
// chrome.contextMenus.onClicked.addListener(function(info, tab) {
//   if (info.menuItemId === "unword-context") { 
//     Unword.Storage.addQuestion(info['selectionText'], function(){
//       Unword.Badge.update();
//     });
//   }
// });

document.addEventListener("DOMContentLoaded", function(){
  // Unword.Tick.run();
  // Unword.Notification.show('Started');
  // Unword.Badge.update();
  // indexedDB.deleteDatabase('questions-database');
  // indexedDB.deleteDatabase('questions-database-2');
  
  // Unword.Storage.add('vocabularies', Unword.Models.Vocabulary.new({name: 'week days test'}), function(id){
  //   Unword.Storage.add('questions', Unword.Models.Question.new({
  //     vocabulary_id: id,
  //     question: "How many days in a week",
  //     question_explain: "Regular week, just it",
  //     answer: '7',
  //     answer_explain: "Week have 7 days"
  //   }));
  //   Unword.Storage.add('questions', Unword.Models.Question.new({
  //     vocabulary_id: id,
  //     question: "How many days in a week + 1",
  //     question_explain: "Regular week, just plus one",
  //     answer: '8',
  //     answer_explain: "Week have 7 days + 1 = 8"
  //   }));
  //   
  // });
  
//   Unword.Storage.add('vocabularies', Unword.Models.Vocabulary.new({name: 'test voc 2'}));
//   Unword.Storage.add('vocabularies', Unword.Models.Vocabulary.new({name: 'test voc 3'}));
//   Unword.Storage.add('vocabularies', Unword.Models.Vocabulary.new({name: 'test voc 4'}));
}, false);
