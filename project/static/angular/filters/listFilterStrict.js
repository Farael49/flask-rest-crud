'use strict'

angular.module('flaskAngular').filter('listFilterStrict', function($filter) {
  return function(items, filteredProperties, strictComparisonProperties) {
    if(filteredProperties ==  undefined || filteredProperties.length == 0){
        return items;
    }
    var normalFilter = angular.copy(filteredProperties);
    var strictFilter = {};
    angular.forEach(strictComparisonProperties, function(property){
        if(normalFilter.hasOwnProperty(property)){
            strictFilter[property] = normalFilter[property];
            delete normalFilter[property];
        }
    });

    var filtered = [];
    filtered = $filter('filter')(items,normalFilter);
    filtered = $filter('filter')(filtered,strictFilter, true);
    return filtered;
  };
});
