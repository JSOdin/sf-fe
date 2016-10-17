(function () {

    'use strict';

    angular.module('myapp').factory('gameResource', GameResource);

    GameResource.$inject =['$http', '$q', '$resource'];

    function GameResource($http, $q, $resource) {
        var REST = $resource('/fetchgames/:searchterm', {searchterm: '@searchterm'});

        return {
            getGames: function (term, cb, errcb) {
                return REST.query({searchterm: term}, cb, errcb);
            }
        }
    }
})();
