angular.module('unword.routes', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/vocabularies',{
        templateUrl: 'unword/vocabularies.html',
        controller: 'VocabulariesController'
      })
      .when('/questions/:vocabulary_id',{
        templateUrl: 'unword/questions.html',
        controller: 'QuestionsController'
      })
      .when('/config',{
        templateUrl: 'unword/config.html',
        controller: 'ConfigController'
      })
      .otherwise({
        redirectTo: '/vocabularies'
      });
  }]);