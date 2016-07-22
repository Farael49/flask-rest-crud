angular.module('flaskAngular').controller('RoleManagerController', function ($scope, RoleService, Role, ngDialog){
    $scope.roles = RolesService.getRoles();
    $scope.authorities = RolesService.getAuthorities();
    $scope.displayedAuthorities = [];
    $scope.changeSelectedRole = function(role){
        changeWorkingRole(role);
    }

    $scope.affectSelectedAuthority = function(){
        setAuthoritiesAffectation($scope.selectedAvailableAuthorities,true);
    }

    $scope.removeSelectedAuthority = function(){
        setAuthoritiesAffectation($scope.selectedRoleAuthorities,false);
    }

    $scope.createNewRole = function(){
        var newRole = new Role();
        newRole.id=0;
        newRole.name="Nouveau role";
        newRole.deletable=true;
        $scope.roles.push(newRole);
        changeWorkingRole(newRole);
        $scope.role = $scope.roles[$scope.roles.length-1];
    }

    $scope.saveRole = function(role){
        var affectedAuthorities = _.filter($scope.displayedAuthorities , function (auth){ return auth.affected === true});
        role.authorities=[];

        for(var index=0; index < $scope.authorities.length; index++){
            if(_.where(affectedAuthorities, $scope.authorities[index]).length > 0){
                role.authorities.push($scope.authorities[index]);
            }
        }
        RolesService.saveRole(role, $scope);
    }

    $scope.deleteRole = function(role){
        ngDialog.openConfirm({
            showClose: false,
            closeByEscape: false,
            closeByDocument: false,
            template: 'DeleteRoleDialogTemplate'
        }).then(function() {
            RolesService.deleteRole(role, $scope);
        });
    }

    var changeWorkingRole=function(role){
        $scope.displayedAuthorities = [];
        for(var index=0; index < $scope.authorities.length; index++){
            var displayedAuthority = _.clone($scope.authorities[index]);
            if(_.where(role.authorities, displayedAuthority).length > 0){
                displayedAuthority.affected = true;
            }else{
                displayedAuthority.affected = false;
            }
            $scope.displayedAuthorities.push(displayedAuthority);
        }
    }

    var setAuthoritiesAffectation = function(selection, isAffected){
        var authorities = _.intersection($scope.displayedAuthorities,selection);
        if(authorities){
             for(var index=0; index < authorities.length; index++){
                 authorities[index].affected = isAffected;
             }
         }
    }
});