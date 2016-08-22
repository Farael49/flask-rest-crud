/**
 * Created by Christophe on 31/05/2015.
 */
'use strict';

angular.module('flaskAngular')
    .controller('MainController', function ($scope, User, $interval,$window) {
    $scope.title = "angularFlask";
    $scope.user = null;

    User.isLogged(function(user){
        $scope.user = user;
    });

    $scope.signup = function(data){
        User.save(data, function(res){
            $scope.signin(data);
        });
    }
    $scope.signin = function(data){
        User.login(data, function(res){
            $scope.user = res;
        });
    }
    $scope.logout = function(){
        User.logout(function(res){
            $scope.user = res;
        });
    }
    $scope.clock = Date.now();
    $interval(function () { $scope.clock = Date.now(); }, 1000);


    });
