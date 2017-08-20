'use strict';

angular.module('core.item').

factory('Item', ['$resource', function($resource) {
  return $resource('items/:itemId.json', {}, {
    query: {
      mehtod: 'GET',
      params: {itemId: 'items'},
      isArray: true
    }
  });
}]);
