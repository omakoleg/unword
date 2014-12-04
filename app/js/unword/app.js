angular.module('unword.app',[
  'unword.routes',
  'unword.controllers',
  'unword.services'
])
.config( [
    '$compileProvider',
    function( $compileProvider )
    {   
        // allow unsafe in url
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension):/);
    }
]);

angular.module('unword.services', []);
angular.module('unword.routes', ['ngRoute']);
angular.module('unword.controllers', ['ngMessages']);