angular.module('unword.controllers')
.controller('VocabulariesController', [ '$scope', 'dialogs', 'VocabulariesService',
  function($scope, dialogs, VocabulariesService){
  
  // angular not support change on file input
  document.getElementById("func-add-vocabulary").addEventListener("change", function(){
    if(event.target.files.length == 0){ return; };
    var file = event.target.files[0];
    if(file.type == 'text/csv'){
      var fileReader = new FileReader();
  		VocabulariesService.loadCsvFile(file, function(){
  		  // reload
        VocabulariesService.loadVocabularies(function(list){
          $scope.$apply(function(){
            $scope.vocabularies = list;
          });
        });
        dialogs.show('File loaded');
  		});
    } else {
      dialogs.show("This is not csv file");
    }
    document.getElementById("func-add-vocabulary").value = "";
  });
  // download file
  $scope.download = function(vocabulary){
    VocabulariesService.generateCsvFile(vocabulary.id);
  }
  // delete voabulary
  $scope.remove = function(vocabulary){
    VocabulariesService.remove(vocabulary, function(){
      $scope.$apply(function(){
        $scope.vocabularies.splice($scope.vocabularies.indexOf(vocabulary), 1 );
      });
    });
  }
  // toggle active
  $scope.activate = function(vocabulary){
    VocabulariesService.toggleActive(vocabulary);
  }
  // list
  VocabulariesService.loadVocabularies(function(list){
    $scope.$apply(function(){
      $scope.vocabularies = list;
    });
  });
}])