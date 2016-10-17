(function(){
    'use strict';

    angular.module('myapp').factory('rawuser',Rawuser);

    Rawuser.$inject = ['$resource'];

    function Rawuser($resource){
        var REST = $resource('/users/getrawuser');

        return {
            getuser:function(cb){
                return REST.get({},cb)
            }
        }
    }
})();