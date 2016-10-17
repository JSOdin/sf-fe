(function(){
    'use strict';

    angular.module('myapp').controller('signupprivateController',SignupPrivateController);

    SignupPrivateController.$inject = ['usersResource','$state','userStore','Dialog','$mdDialog','$scope','$window'];

    function SignupPrivateController(usersResource, $state, userStore, Dialog, $mdDialog, $scope, $window){
        var signupprivCtrl = this;
        signupprivCtrl.goToPosts = goToPosts;

        signupprivCtrl.openExplainDialog = openExplainDialog;

        signupprivCtrl.closeExplainDialog = closeExplainDialog;

        signupprivCtrl.openSteamProfile = openSteamProfile;

        $scope.user = userStore.user;

        $scope.$watch('user',function(nV,oV){
            signupprivCtrl.profileurl = nV.profileurl;
        },true);

        function openSteamProfile(url){
            $window.open(url)
        }

        function goToPosts() {
           /* userResource.getOwnedGames(userStore.user.steamid,function(data){
                userStore.user = data;
            });*/

            usersResource.submitInitial({},function(){
                userStore.user.settings.admin.generalpersonal = true;
                $state.go('wantstoplay');
            });
        }

        function openExplainDialog($event){
            var dialog = new Dialog.openModal($event, 'signupprivateController as signupprivCtrl','/partials/explainwindow');
            dialog.show();
        }

        function closeExplainDialog(){
            $mdDialog.hide();
        }
    }
})();