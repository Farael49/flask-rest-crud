'use strict'

angular.module('flaskAngular')
    .directive('filteredTableClient', function($filter, $translate) {
        return {
            restrict : 'E',
            templateUrl : 'filtered-table-client/filtered-table-client.html',
            scope : {
                headers : '=',
                model : '=',
                sortDir: '=',
                sortBy: '=',
                go : '&',
                rowNgClass: '@',
				sref: '@?',
                srefGo: '@?',
                models: '=?',
                pageSize: '=?',
                modelsExactMatch:'=?',
                tableScroll: '=?',
                passedData: '=?'
            },
            link : function($scope) {
                $scope.pageSize = $scope.pageSize || 25;
                $scope.pageNumber = 1;
                $scope.models2 = {};
                $scope.srefGo = $scope.srefGo || false;
				$scope.tableScroll = $scope.tableScroll || 0;
				$scope.modelsExactMatch = angular.isDefined($scope.modelsExactMatch)? $scope.modelsExactMatch: [];


                // Will be called when filtering the grid, will reset the page
                // number to one
                $scope.filterResult = function(modelName) {
                    var nameParts = modelName.split(".");
                    var depth = nameParts.length;
                    var currentProperty = $scope.models2;
                    //Iteration on nested properties of the model
                    for (var i = 0; i < depth; i++){
                        if (i < depth - 1){
                            //Non-terminal properties, creation of the property-tree if it doesn't exist yet
                            if (!currentProperty[nameParts[i]]){
                                currentProperty[nameParts[i]] = {};
                            }
                            currentProperty = currentProperty[nameParts[i]];
                        } else if ($scope.models[modelName]){
                            //Terminal property, with a filter, setting the value of the property
                            currentProperty[nameParts[i]] = $scope.models[modelName];
                        } else {
                            //Terminal property, without a filter, unsetting the property
                            delete currentProperty[nameParts[i]];
                            //If a non-terminal property is left empty, it should be deleted too
                            for (var j = depth - 2; j >= 0; j--){
                                var current = $scope.models2;
                                for (var k = 0; k < j; k++){
                                    current = current[nameParts[k]];
                                }
                                if ($.isEmptyObject(current[nameParts[j]])){
                                    delete current[nameParts[j]];
                                }
                            }
                        }
                    }
                };
                if ($scope.models) {
                    for (var modelName in $scope.models) {
                         $scope.filterResult(modelName);
                    }
                } else {
                    $scope.models = {};
                }

                // call back function that we passed to our custom directive sortBy,
                // will be called when clicking on any field to sort
                $scope.onSort = function(sortedBy, sortDir) {
                    $scope.sortDir = sortDir;
                    $scope.sortBy = sortedBy;
                };

                $scope.resolve = function(cur, header,title) {
                    if (header.resolveFunction !== undefined) {
                        return header.resolveFunction(cur, header, title);
                    }
                    if (title && !header.summaryValue){
                        return "";
                    }
                    var ns = (header.summaryValue && !title) ? header.summaryValue : header.value;
                    var type = header.type
                    var undef;
                    ns = ns.split('.');
                    while (cur && ns[0]) {
                        cur = cur[ns.shift()];
                    }
                    if (cur && type !== undefined && type == 'date') {
                        var format = header.format;
                        if (format !== undefined) {
                            return $filter('date')(cur, format);
                        } else {
                            return $filter('date')(cur, 'medium');
                        }
                    }
                    if (cur !== undefined && header.translateBase !== undefined) {
                        return $filter('translate')(header.translateBase + cur);
                    }
                    return cur;

                };
				$scope.clickGo = function(object) {
					$scope.go({
					    object : object
					});
				};

				$scope.callSrefGo = function(object) {
                    if ($scope.srefGo) {
                        return $scope.go({object: object});
                    }
                    return $scope.sref + '({id:' + object.id + '})';
                }

                $scope.$watch('models', function(newValue, oldValue){
                    if(newValue != oldValue){
                        for (var modelName in $scope.models) {
                            $scope.filterResult(modelName);
                        }
                    }
                }, true);

                $scope.stopEvent = function($event){
                    $event.stopPropagation();
                }
			}
		};
});
