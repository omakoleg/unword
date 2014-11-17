var Unword = Unword || {};

Unword.Popup = (function () {
  var module = {};
  module.init = function(){
    // Unword.Storage.readAll('words', function(data){
    //   console.log(data);
    // });
    module.loadVocabulariesList();
  }  
  module.vocabularyTemplate = function(data){
    return $("<li class='list-group-item'> \
      <span class='badge'>" + data.count + "</span> \
      <button data-id='"+ data.id + "' \
        class='btn btn-xs " + data.active_class +"'>" + data.active_label +"</button> \
      " + data.name + " \
    </li>");
  }
  module.loadVocabulariesList = function(){
    // should be lazy loaded
    $(".tmpl-holder").html("");
    Unword.Storage.readAll('vocabularies', function(list){
      $.each(list, function(i, elem){
        var data = {
          id: elem.id,
          name: elem.name,
          count: Unword.Models.Vocabulary.wordsCount(elem.id),
          active_label: elem.is_active ? 'active' : 'activate',
          active_class: elem.is_active ? 'btn-info' : ''
        };
        var tmpl = module.vocabularyTemplate(data);
        tmpl.find("button").on('click', function(e){
          module.setVocabulary(e);
        });
        $(".tmpl-holder").append(tmpl);
      });
    });
  }
  module.setVocabulary = function(e){
    var btn = $(e.target);
    
    Unword.Storage.get('vocabularies', btn.data('id'), function(data){
      data.is_active = data.is_active ? 0 : 1;
      Unword.Storage.update('vocabularies', data, function(){
        module.loadVocabulariesList();
      });
    });
  }
  return module;
}());

$(function(){
  Unword.Popup.init();
  setTimeout(function(){
    $("#answer").focus();
  }, 300);
});
