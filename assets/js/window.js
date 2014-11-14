var app = angular.module('unword',[]);
app.controller('WindowController', function($scope){
  var self = this;
  self.test = "test";
  self.words = [{id: 1, text: 'ttt'}];
  Unword.Storage.readWords(function(data){
    $scope.$apply(function(){
      self.words = data;
    });
  });
});
