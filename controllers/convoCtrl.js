(function(){
    'use strict';

    angular.module('myapp').controller('conversationController', ConversationController);

    ConversationController.$inject = ['userResource','userStore','Dialog','toast'];

    function ConversationController(userResource, userStore,Dialog,toast){
        var msgCtrl = this;

        /** fetch messages data **/

        userResource.getConvos(userStore.user.steamid, function(data){

            msgCtrl.conversations = data.filter(function(ea){           // only display convos with messages
                return ea.messages.length > 0;
            });

            userStore.user.conversations = data;
        });

        /** methods **/

        msgCtrl.deleteAll = deleteAll;

        msgCtrl.confirmDelete = confirmDelete;

        msgCtrl.cancelDelete= cancelDelete;

        function deleteAll($event){
            var dialog;
            dialog = new Dialog.openModal($event,'conversationController as convoCtrl','/partials/confirmmodal');

            dialog.show().then(function(){
                msgCtrl.conversations = [];
            });
        }

        function confirmDelete(){
            userResource.deleteAllConvos(userStore.user.steamid,function(){
                Dialog.hide(function(){
                    toast.triggerToast({}, 'Conversations deleted.','conversationController as convoCtrl','success-toast','.convo-toast',3000);
                })
            },function(err){

            });
        }

        function cancelDelete(){
            Dialog.cancel(function(){});
        }
    }
})();