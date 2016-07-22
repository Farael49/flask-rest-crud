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