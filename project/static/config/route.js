'use strict';

angular.module('flaskAngular')
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/views/articles.html',
                controller: 'ArticleListController'
            })
            .otherwise({
                redirectTo: '/'
            });

    }]);
