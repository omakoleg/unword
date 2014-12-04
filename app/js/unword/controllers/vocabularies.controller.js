angular.module('unword.controllers')
.controller('VocabulariesController', [ '$scope', 'dialogs', 'VocabulariesService',
  function($scope, dialogs, VocabulariesService){
  
  // angular not support change on file input, need to write tons of shit ):
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
            $scope.addSuccessAlert = true;
            setTimeout(function(){
              $scope.$apply(function(){ $scope.addSuccessAlert = false; })
            }, 3000);
          });
        });
  		});
    } else {
      $scope.$apply(function(){ $scope.addErrorAlert = true; });
      setTimeout(function(){
        $scope.$apply(function(){ $scope.addErrorAlert = false; })
      }, 3000);
    }
    document.getElementById("func-add-vocabulary").value = "";
  });
  // download file
  $scope.download = function(vocabulary){
    VocabulariesService.generateCsvFile(vocabulary.id);
  }

  $scope.remove = function(vocabulary){
    VocabulariesService.remove(vocabulary, function(){
      $scope.$apply(function(){
        $scope.vocabularies.splice($scope.vocabularies.indexOf(vocabulary), 1 );
      });
    });
  }
  
  $scope.activate = function(vocabulary){
    VocabulariesService.toggleActive(vocabulary);
  }
  
  $scope.addVocabulary = function(){
    $scope.vocabulary = Unword.Models.Vocabulary.new({name: "Sample name"});
  }
  
  $scope.saveVocabulary = function(isValid){
    if(isValid){
      VocabulariesService.save($scope.vocabulary, function(data){
        $scope.$apply(function(){
          if(!$scope.vocabulary.id){
            $scope.vocabulary.id = data;
            $scope.vocabularies.push($scope.vocabulary);
          }
          $scope.vocabulary = null;
        });
      });
    }
  }
  
  $scope.cancelForm = function(){
    $scope.vocabulary = null;
  }
  
  $scope.editVocabulary = function(vocabulary){
    $scope.vocabulary = vocabulary;
  }
  VocabulariesService.loadVocabularies(function(list){
    $scope.$apply(function(){
      $scope.vocabularies = list;
    });
  });
}])