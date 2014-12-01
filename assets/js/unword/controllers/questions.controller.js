angular.module('unword.controllers')
.controller('QuestionsController',['$scope', 'QuestionsService', '$routeParams', 'dialogs', 'VocabulariesService',
  function($scope, QuestionsService, $routeParams, dialogs, VocabulariesService){
    // 
    $scope.vocabulary_id = parseInt($routeParams.vocabulary_id);
    $scope.question = null;
    //
    VocabulariesService.get($scope.vocabulary_id, function(item){
      $scope.vocabulary = item;
    })
    
    QuestionsService.getListByVocabularyId($scope.vocabulary_id, function(list){
      $scope.$apply(function(){
        console.log(list);
        $scope.questions = list;
      })
    });
    
    $scope.removeQuestion = function(question){
      if(dialogs.ask('Delete this question?', function(){
        QuestionsService.remove(question, function(){
          $scope.$apply(function(){
            $scope.questions.splice($scope.questions.indexOf(question), 1 );
          });
        });
      }));
    }
    
    $scope.addQuestion = function(){
      $scope.question = Unword.Models.Question.new({
        vocabulary_id: $scope.vocabulary_id
      });
    }
    
    $scope.saveQuestion = function(){
      QuestionsService.save($scope.question, function(data){
        console.log(data);
        $scope.$apply(function(){
          if(!$scope.question.id){
            $scope.questions.push($scope.question);
          }
          $scope.question = null;
        });
      });
    }
    
    $scope.cancelForm = function(){
      $scope.question = null;
    }
    
    $scope.editQuestion = function(question){
      $scope.question = question;
    }
}]);