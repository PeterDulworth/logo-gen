'use strict';

//Logos service used to communicate Logos REST endpoints
angular.module('logos').factory('userLogos', ['$resource', function($resource) {
    return $resource('logos/user/:userId', { userId: '@user' }, {
        'get': {
            method:'GET',
            isArray: true
        }
    });
}]);

//Logos service used to communicate Logos REST endpoints
angular.module('logos').factory('Logos', ['$resource', function($resource) {
    return $resource('logos/:logoId', { logoId: '@_id' }, {
        update: {
            method: 'PUT'
        }
    });
}]);
