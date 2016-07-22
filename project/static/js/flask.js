/**
 * Created by Christophe on 31/05/2015.
 */
'use strict';

angular.module('flaskAngular', 
	['ngRoute', 
	'ngResource', 
	'summernote', 
	'pascalprecht.translate', 
	'toaster', 
	'ngDialog'
	]);

/**
 * Created by Christophe on 31/05/2015.
 */
angular.module('flaskAngular')
    .constant('baseUrl', 'http://localhost:5000/api/v1/')

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

/**
 * Created by Christophe on 31/05/2015.
 */
'use strict';

angular.module('flaskAngular')
    .controller('ArticleListController', function ($scope, $sce, Article) {

        $scope.sanitize = function (textToSanitize) {
            return $sce.trustAsHtml(textToSanitize);
        }
       // $scope.articleText = {title:"", content:""};

        var getArticles = function () {
            Article.query().$promise.then(function (data) {
                data.editMode = false;
                $scope.articles = data;
                console.log(data);
            }, function (error) {
                console.log(error);
            });
        }

        getArticles();
        console.log("data : ");
        console.log($scope);
        $scope.addArticle = function (data) {
            Article.save(data, function (res) {
                $scope.articles.push(res);
                console.log(res);
            }, function (err) {
                console.log(err);
            });
        }
        $scope.editArticle = function (article) {
            Article.update({id: article._id}, article, function (res) {
                console.log(res);
                article.editMode = false;
            }, function (err) {
                console.log(err);
            });
        }

        $scope.removeArticle = function (articleId) {
            Article.delete({id: articleId}, function () {
                $scope.articles = _.reject($scope.articles, function (article) {
                    return article._id == articleId;
                });
            });
        }

    });

/**
 * Created by Duncan on 22/06/2015.
 */
'use strict';

angular.module('flaskAngular')
    .controller('CommentController', function ($scope, Article) {

        $scope.editing = [];

        $scope.addCommentaire = function(articleId, data){
            Article.save({id:articleId, target:'comment'}, data, function(res){
                $scope.article.comments.push(res);
                console.log(res);
            }, function(err){
                console.log(err);
            });
        }

        $scope.removeCommentaire = function (articleId, commentaireId) {
            Article.deleteCommentaire({id: articleId, targetId:commentaireId}, function () {
                $scope.article.comments = _.reject($scope.article.comments, function (comment) {
                    return comment._id == commentaireId;
                });
            });
        }

    });

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
            $scope.user = res;
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

    $scope.signinfb = function(){
        $window.location = $window.location.protocol + "//" + $window.location.host + $window.location.pathname + "users/login/facebook";
    }

    });

angular.module('flaskAngular').controller('RoleManagerController', function ($scope, RoleService, Role, ngDialog){
    $scope.roles = RoleService.getRoles();
    $scope.authorities = RoleService.getAuthorities();
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
        RoleService.saveRole(role, $scope);
    }

    $scope.deleteRole = function(role){
        ngDialog.openConfirm({
            showClose: false,
            closeByEscape: false,
            closeByDocument: false,
            template: 'DeleteRoleDialogTemplate'
        }).then(function() {
            RoleService.deleteRole(role, $scope);
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
/**
 * Created by Christophe on 31/05/2015.
 */
'use strict';

angular.module('flaskAngular')
    .factory('Article', function($resource){
        return $resource('/articles/:id/:target/:targetId',{
                id:"@id",
                target:"@target",
                targetId:"@targetId"
            },
            {
                update:{
                    method:'PUT'
                },
                deleteCommentaire:{
                    method:'DELETE',
                    params:{
                        target:'comment'
                    }
                }
            });
    });

angular.module('flaskAngular').factory('Authorities', function ($resource, baseUrl) {
    return $resource(baseUrl+ 'authority', {}, {});
});
angular.module('flaskAngular').factory('Role', function ($resource, baseUrl){
    var Role = $resource(baseUrl+'roles/:id',{id:'@id'},
        {
            'query': {
                method: 'GET',
                isArray: true,
                transformResponse: function(data, header) {
                    var wrapped = angular.fromJson(data);
                    angular.forEach(wrapped, function(item, idx) {
                        wrapped[idx] = new Role(item);
                    });
                    return wrapped;
                }
            },
            'update':{method:'PUT'},
            'create':{method:'POST'},
            'delete':{method:'DELETE'}
        });
        return Role;
});
/**
 * Created by Christophe on 21/06/2015.
 */

'use strict';


angular.module('flaskAngular')
    .factory('User', function($resource){
        return $resource('/users/:id/:target',{
                id:"@id",
                target:"@target",
            },
            {
                login:{
                    method:'POST',
                    params:{
                        target:"login"
                    }
                },
                logout:{
                    method:'GET',
                    params:{
                        target:"logout"
                    }
                },
                isLogged:{
                   method:'GET',
                    params:{
                        target:"logged"
                    }
                },

                loginfb:{
                    method: 'GET',
                    params:{
                        id: "login",
                        target: "facebook"
                    }
                }
            });
    });

angular.module('flaskAngular')
.service('Message', function (toaster, $translate) {
	this.getMessageOk = function (message, data) {
		$translate(message, data).then(function (message){
			toaster.pop('success', message);
		});
	};

	this.getMessageError = function (message, data) {
		$translate(message, data).then(function (message){
			toaster.pop('error', message);
		});
	};
	this.warning = function (message, data) {
        $translate(message, data).then(function (message){
            toaster.pop('warning', message);
        });
    };
    this.error = function (message, data) {
        this.getMessageError(message, data);
    };
    this.success = function (message, data) {
        this.getMessageOk(message, data);
    };
})
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
