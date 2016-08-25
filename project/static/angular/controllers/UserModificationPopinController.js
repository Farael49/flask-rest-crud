'use strict';

angular.module('flaskAngular').controller('UserModificationPopinController', function ($scope, User, RoleService, Message, ngDialog, ConfirmDialog) {
    $scope.loadedUser = $scope.ngDialogData;
    $scope.userRoles = [];
    $scope.roles = RoleService.getRoles();
    if ($scope.loadedUser){
        $scope.userRoles = $scope.loadedUser.roles;
    }
    $scope.compareFn = function(obj1, obj2){
         return obj1.id === obj2.id;
    };

    $scope.reinitNbEssaisLogin = function(){
        User.reinitNbEssaisLogin({id:$scope.loadedUser.id}, function(){
            $scope.ngDialogData.nbEssaisLogin = 0;
        });
    }
    $scope.askCancel = function(){
           if($scope.usersModificationForm.$dirty === true){
               ngDialog.openConfirm({
                   showClose: false,
                   closeByEscape: false,
                   closeByDocument: false,
                   template: 'views/popin/confirm_cancel.html'
               }).then(function() {
                   $scope.closeThisDialog();
               });
           }else{
               $scope.closeThisDialog();
           }
       };

    $scope.saveDialog = function(){
           ngDialog.openConfirm({
               showClose: false,
               closeByEscape: false,
               closeByDocument: false,
               template: 'views/administration/popin/confirm_change.html'
           }).then(function() {
               save();
           });
    }

    $scope.generatePassword = function(){
        ConfirmDialog.confirm("administration.user_list.messages.confirmRegeneratePassword").then(function(){
            User.generatePassword({id:$scope.loadedUser.id}, function(password){
                 $scope.ngDialogData.passwordPlain = password.password;
             });
        });
    }

    var save = function(){
        var promise;
        var succesMessage;
        if ('id' in $scope.ngDialogData) {
            $scope.loadedUser.roleSet = $scope.userRoles;
            promise = User.updateUser({id:$scope.loadedUser.id},$scope.loadedUser);
            succesMessage = "administration.user_list.messages.saveSuccess";
        } else {
            $scope.ngDialogData.roleSet = $scope.userRoles;
            promise = User.createUser($scope.ngDialogData);
            succesMessage = "administration.user_list.messages.createSuccess";
        }
        promise.$promise.then(
           function (data) {
                Message.getMessageOk(succesMessage);
                $scope.closeThisDialog(data);
                return true;
           },
           function (responseBody) {
                Message.getMessageError("contrevenant.messages.saveError");
                $scope.usersModificationForm.$invalidServerResponse=true;
                if(responseBody.data.fieldErrors != null){
                     $scope.fieldsErrorMessages = responseBody.data.fieldErrors;
                }
                if(responseBody.data.globalErrors != null){
                     $scope.globalErrorMessages = responseBody.data.globalErrors;
                }
                     return false;
           });
    }
});
