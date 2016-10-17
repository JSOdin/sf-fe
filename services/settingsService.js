(function(){
    'use strict';

    angular.module('myapp').factory('settingsService',settingsService);

    settingsService.$inject = ['$http','toast','userStore'];

    function settingsService($http,toast,userStore){

        return {
            updateSettings : function(postData){
                $http.post('/users/updatesettings/'+userStore.user.steamid,postData)        /** TODO? **/
                    .then(function () {
                        toast.triggerToast({},'Settings saved','settingsController','success-toast','.settings-toast',3000);
                    }, function errorCallback(err) {
                        console.log(err);
                    })
            }
        }
    }
})();