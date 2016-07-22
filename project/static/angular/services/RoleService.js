angular.module('flaskAngular').factory('RoleService',function(Authorities, Role, Message){
    return {
        getRoles : function(){
            return Role.query();
        },
        getAuthorities : function(){
            return Authorities.query();
        },
        saveRole: function(role, $scope){
            if(role.id == 0){
                role.$create({},
                    function(value){role = value},
                    function(error){$scope.saveError = true}
                );
            }else{
                role.$update({},
                    function(value){
                        Message.getMessageOk("messages.saveSuccess");
                    }, 
                    function(error){
                        Message.getMessageOk("messages.saveError");
                    }
                );
            }
        },
        deleteRole: function(role, $scope){
            var deleteRoleFromRoles= function(role, $scope){
                var index = $scope.roles.indexOf(role);
                if(index > -1){
                    $scope.roles.splice(index, 1);
                }
                $scope.role=null;
                $scope.displayedAuthorities = [];
            };

            if(_.isNull(role) || role.deletable == true){
                if(role.id != 0){
                    role.$delete({},
                        function(value){
                            deleteRoleFromRoles(role, $scope);
                            Message.getMessageOk("messages.saveSuccess");
                        },
                        function(error){
                            Message.getMessageOk("messages.saveError");
                        }
                    );
                }else{
                    deleteRoleFromRoles(role,$scope);
                }
            }
        }
    };
});
