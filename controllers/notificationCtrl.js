(function(){
    'use strict';

    angular.module('myapp').controller('notificationController', notificationController);

    notificationController.$inject = ['userResource','userStore','Dialog','toast','$rootScope'];

    function notificationController(userResource, userStore,Dialog,toast,$rootScope){
        var notificationCtrl = this;

        notificationCtrl.yourprofile = userStore.user.userPageID;

        /** fetch messages data **/

        notificationCtrl.notices = userStore.user.notifications;

        userResource.getNotices(userStore.user.steamid, function(data){

            notificationCtrl.notices = data;
            userStore.user.notices = data;
            userStore.user.notifications.forEach(function(ea,i){
                userStore.user.notifications[i].read = true;
            });
            $rootScope.$emit('noticesread');
        });
    }
})();