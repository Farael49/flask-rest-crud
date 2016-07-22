angular.module('flaskAngular').factory('Authorities', function ($resource, baseUrl) {
    return $resource(baseUrl+ 'authority', {}, {});
});