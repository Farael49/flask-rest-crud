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
