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
