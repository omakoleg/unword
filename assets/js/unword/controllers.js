angular.module('unword.controllers')
.controller('VocabulariesController', function($scope){
  
  $scope.download = function(vocabulary){
    Unword.Files.downloadVocabulary(vocabulary.id);
  }
  $scope.remove = function(vocabulary){
    Unword.Models.Vocabulary.deleteRecursive(vocabulary.id, function(){
      $scope.$apply(function(){
        $scope.vocabularies.splice( $scope.vocabularies.indexOf(vocabulary), 1 );
      });
    });
  }
  $scope.activate = function(vocabulary){
    vocabulary.is_active = vocabulary.is_active ? 0 : 1;
    Unword.Storage.update('vocabularies', vocabulary);
  }
  Unword.Storage.readAll('vocabularies', function(list){
    $scope.$apply(function(){
      $scope.vocabularies = list;
    });
    angular.forEach(list, function(value, key) {
      Unword.Storage.count('questions', { index: { name: 'vocabulary_id', value: value.id }}, function(cnt){
        $scope.$apply(function(){
          value.count = cnt;
        });
      });
    });
  });
})
.controller('ConfigController', function($scope){
  
});