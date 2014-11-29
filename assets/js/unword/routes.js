angular.module('unword.routes', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/vocabularies',{
        templateUrl: 'unword/vocabularies.html',
        controller: 'VocabulariesController'
      })
      .when('/config',{
        templateUrl: 'unword/config.html',
        controller: 'ConfigController'
      })
      .otherwise({
        redirectTo: '/vocabularies'
      });
  });