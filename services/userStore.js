// a service for the sole purpose of copying the USer constant, because it is bad practice to modify angular constants

(function(){
    'use strict';

    angular.module('myapp').factory('userStore',UserStore);

    UserStore.$inject = ['userResource'];

    function UserStore(userResource){
       /* var user = User != null ? angular.copy(User) : {};*/

        var user = userResource.getUser('thisuser');
        return {
            user: user
        }
    }
})();