(function () {
    'use strict';

    angular.module('myapp').factory('usersResource', UsersResource);

    UsersResource.$inject = ['$resource'];

    function UsersResource($resource) {
        var REST = $resource('/users/:path/:game', {path: '@path', game: '=game'}, {
            post: {method: 'POST'},
            postArr: {method: 'POST', isArray: true}
        });

        return {
            getUsers: function (param, cb, errcb) {
                param = param ? param : '';
                return REST.query({path: 'fetchusers', game: param}, cb, errcb);
            },
            /*!!! getUsers: function(cb){
             return REST.query({path:'fetchusers'},cb);
             },*/
            sendSearchForm: function(postData, cb,errcb){
                return REST.postArr({path: 'searchbyform',game: ''}, postData, cb,errcb);  // something spomething data type wrong
            },
            getNextBatch: function(postData, cb,errcb) {
                return REST.postArr({path: 'searchbyform',game: 'next'}, postData, cb,errcb);
            },
            getPreviousBatch: function(postData,cb, errcb) {
                return REST.postArr({path: 'searchbyform',game: 'previous'}, postData, cb,errcb);
            },
            submitInitial: function(postData,cb){
                return REST.post({path: 'submitinitial', game:''}, postData,cb);
            },
            submitGameProfile: function(postData, cb){
                return REST.post({path: 'submitgameprofile', game: ''}, postData,cb);
            },
            quickFetch: function(game,cb,errcb){
                return REST.get({path:'quickmatch',game:game},cb,errcb);
            }
        }
    }
})();