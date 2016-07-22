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
