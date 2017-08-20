'use strict';

angular.module('rpgGeneratorApp').

config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.
    when('/treasure-generator', {
        template: '<treasure-generator></treasure-generator>'
    }).
    otherwise('/treasure-generator');
}]);
