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
