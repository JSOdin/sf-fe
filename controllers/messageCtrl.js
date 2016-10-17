(function(){
    'use strict';

    angular.module('myapp').controller('messageController',MessageController);

    MessageController.$inject = ['userResource','$mdDialog','userStore'];

    function MessageController(userResource, $mdDialog,userStore){
        var msgCtrl = this;

        msgCtrl.user = userResource.tempUserCache;

        msgCtrl.commentuser = userResource.tempCommentUserCache;                // usercache will be empty when sending message to others not in comments.

        if (Object.keys(userResource.tempCommentUserCache).length > 0){
            msgCtrl.recipient = msgCtrl.commentuser.author;
        } else {
            msgCtrl.recipient = msgCtrl.user.personaname;
        }

        msgCtrl.sendMessage = sendMessage;

        msgCtrl.sendSuggestion = sendSuggestion;

        function sendSuggestion(gamename,details){
            var data = {
                gamename: gamename,
                details: details
            };

            userResource.sendGameSuggestion(data,function(){
                console.log('finished')
            });
            $mdDialog.hide();
        }

        function sendMessage(subject,body){
            var payload, recipientID;
            if (Object.keys(userResource.tempCommentUserCache).length > 0){
                payload = {
                    conversation:{
                        from: userStore.user.personaname,
                        fromsteamid: userStore.user.steamid,
                        touserpageid: msgCtrl.commentuser.authorpageid,
                        to: msgCtrl.commentuser.author,
                        tosteamid: msgCtrl.commentuser.authorid,
                        subject: subject
                    },
                    message :{
                        from: userStore.user.personaname,
                        fromsteamid: userStore.user.steamid,
                        frompageid: userStore.user.userPageID,
                        body : body,
                        submitted: new Date()
                    }
                };
                recipientID = msgCtrl.commentuser.authorid;

            } else {
                payload = {             // we make a new conversation plus the initial message.
                    conversation:{
                        from: userStore.user.personaname,
                        fromsteamid: userStore.user.steamid,
                        touserpageid: msgCtrl.user.userPageID,
                        to: msgCtrl.user.personaname,
                        tosteamid: msgCtrl.user.steamid,
                        subject: subject
                    },
                    message :{
                        from: userStore.user.personaname,
                        fromsteamid: userStore.user.steamid,
                        frompageid: userStore.user.userPageID,
                        body : body,
                        submitted: new Date()
                    }
                };
                recipientID = msgCtrl.user.steamid;

            }

            if (subject.length > 0 && body.length > 0) {
                userResource.sendMessage(payload, recipientID, function () {
                    userResource.tempCommentUserCache = {};
                });
                $mdDialog.hide();
            }
        }
    }
})();