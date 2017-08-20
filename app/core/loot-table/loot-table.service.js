'use strict';

angular.module('core.lootTable').

factory('LootTable', ['$resource', function($resource) {
  return $resource('loot-tables/:lootTableId.json', {}, {
    query: {
      mehtod: 'GET',
      params: {lootTableId: 'loot-tables'},
      isArray: true
    }
  });
}]);
