(function(){
    'use strict';

    angular.module('myapp').controller('singleConvoController',SconvoController);

    SconvoController.$inject = ['userResource','userStore','$stateParams','$location','$mdDialog','$scope','$state','$rootScope','Dialog'];

    function SconvoController(userResource, userStore, $stateParams,$location, $mdDialog,$scope, $state, $rootScope, Dialog){
        var sconvoCtrl = this;
        sconvoCtrl.convo = [];

        var path = $location.path().split("/");
        var id = path[path.length-1];

        userResource.getConvo(id,function(data){
            sconvoCtrl.convo = data.messages;
            sconvoCtrl.with = data.with;
            sconvoCtrl.withsteamid = data.withsteamid;
            sconvoCtrl.convoid = data._id;
            sconvoCtrl.connectID = data.connectID;
            $rootScope.$emit('convoread');
            userStore.user.conversations.some(function(ea,i){
                if (ea._id == sconvoCtrl.convoid){
                    userStore.user.conversations[i].read = true;
                    return true;
                }
            });
        });

        sconvoCtrl.openMsgForm = openMsgForm;

        sconvoCtrl.reply = reply;

        sconvoCtrl.deleteconvo = deleteconvo;

        function openMsgForm($event){
            var dialog = new Dialog.openModal($event, 'singleConvoController as sconvoCtrl','/partials/messagewindownosubject');
            dialog.show().then(function(data){
                sconvoCtrl.convo.push(data);        // messagewindowsubject and conversation views share the same controller: singleConvoController. so pushing to sconvoCtrl.convo directly in sconvoCtrl.reply will not update the view. need to wait for a promise that contains the post object so we can do it in the conversation context, not the message window context.
            });
        }

        function reply(text){
            var postData = {
                withsteamid: sconvoCtrl.withsteamid,
                from: userStore.user.personaname,
                fromsteamid: userStore.user.steamid,
                frompageid: userStore.user.userPageID,
                body : text,
                connectID: sconvoCtrl.connectID,
                submitted: new Date()
            };

            if (text.length > 0){

                userResource.replyToConvo(postData, sconvoCtrl.convoid,function(){

                });

                $mdDialog.hide(postData);           // pass in a promise
            }
        }

        function deleteconvo(){
            userResource.deleteconvo({},sconvoCtrl.convoid,function(){
                $state.go('conversations');
            });
        }
    }
})();

