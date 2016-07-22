'use strict';

angular.module('flaskAngular')

    .config(function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
//        delete $httpProvider.defaults.headers.common['X-Requested-With'];


    }
    )
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/views/articles.html',
                controller: 'ArticleListController'
            })
            .when('/role-manager', {
                templateUrl:'views/role-manager.html',
                controller:'RoleManagerController'
            })
            .otherwise({
                redirectTo: '/'
            });

    }]);
