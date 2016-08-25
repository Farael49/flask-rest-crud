angular.module('flaskAngular')
.controller('UserListController', function ($scope,User, ngDialog) {
    // Initialize the count to zero
    $scope.count = 0;
    // The column of the table, with the header and her key in the object
    $scope.headers = [{
        title : 'Login',
        value : 'username',
        comparator: '^'
    }, {
        title : 'Firstname',
        value : 'firstName',
        comparator: '^'
    }, {
        title : 'Lastname',
        value : 'lastName',
        comparator: '^'
    }, {
        title : 'Email',
        value : 'email',
        comparator: '^'
    }, {
        title : 'Roles',
        value : 'roleList',
        resolveFunction : function(cur, header, title) {
            if (!cur[header.value]){
                return '';
            }
            var isOne = cur[header.value].split("\n").length <= 1;
            if (title) {
                if (isOne) {
                    return '';
                }
                return cur[header.value];
            } else {
                if (isOne) {
                    return cur[header.value];
                }
                var roles = cur[header.value].split("\n");
                return roles[0] + " (+" + (roles.length - 1) + "...)";
            }
        }
    }];
    // default criteria that will be sent to the server
    $scope.filterCriteria = {
        pageSize : 25,
        pageNumber : 1,
        sortDir : 'asc',
        sortedBy : 'id'
    };
    // The function that is responsible of fetching the result from the server
    // and setting the grid to the new result
    var fetchResult = $scope.fetchResult = function() {
        var users = User.query($scope.filterCriteria, function() {
            $scope.users = users
        });
        return users;
    };
    fetchResult();
    $scope.editUser=function(user){
        var dialog = ngDialog.open({
            template: 'views/popin/user_modification.html',
            scope: $scope,
            controller : 'UserModificationPopinController',
            data:user
        });
        dialog.closePromise.then(function(data){
            fetchResult();
        });
    }
});
