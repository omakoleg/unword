// chrome.contextMenus.create({
//   title: 'Memorize',
//   id: 'unword-context',
//   contexts: ['selection'],
// });
// 
// chrome.contextMenus.onClicked.addListener(function(info, tab) {
//   if (info.menuItemId === "unword-context") { 
//     Unword.Storage.addWord(info['selectionText'], function(){
//       Unword.Badge.update();
//     });
//   }
// });

document.addEventListener("DOMContentLoaded", function(){
  // Unword.Tick.run();
  // Unword.Notification.show('Started');
  // Unword.Badge.update();
  // indexedDB.deleteDatabase('words-database');
  // indexedDB.deleteDatabase('words-database-2');
  
  Unword.Storage.add('vocabularies', Unword.Models.Vocabulary.new({name: 'test voc'}), function(id){
    Unword.Storage.add('words', Unword.Models.Word.new({
      vocabulary_id: id,
      text: "cat",
      example: "Cats rulls the world",
      translation: "кот"
    }));
    Unword.Storage.add('words', Unword.Models.Word.new({
      vocabulary_id: id,
      text: "cow",
      example: "Cow says mooo",
      translation: "корова"
    }));
    Unword.Storage.add('words', Unword.Models.Word.new({
      vocabulary_id: id,
      text: "rabbit",
      example: "It says:die humans",
      translation: "кролик"
    }));
    Unword.Storage.add('words', Unword.Models.Word.new({
      vocabulary_id: id,
      text: "Bender",
      example: "It says:die humans, and it is not rabbit. Ha-ha-ha",
      translation: "Бендер"
    }));
  });
  
//   Unword.Storage.add('vocabularies', Unword.Models.Vocabulary.new({name: 'test voc 2'}));
//   Unword.Storage.add('vocabularies', Unword.Models.Vocabulary.new({name: 'test voc 3'}));
//   Unword.Storage.add('vocabularies', Unword.Models.Vocabulary.new({name: 'test voc 4'}));
}, false);
