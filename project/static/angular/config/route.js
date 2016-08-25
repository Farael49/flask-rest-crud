'use strict';

angular.module('flaskAngular')

    .config(function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
//        delete $httpProvider.defaults.headers.common['X-Requested-With'];


    }
    )
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/role-manager', {
                templateUrl:'views/role-manager.html',
                controller:'RoleManagerController'
            })
            .when('/user_list', {
                templateUrl:'views/user_list.html',
                controller:'UserListController'
            })
            .otherwise({
                redirectTo: '/'
            });
 
    }]);
