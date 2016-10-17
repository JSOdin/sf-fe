(function() {

    'use strict';

    angular.module('myapp').controller('userController', UserController);

    UserController.$inject = ['userResource', '$stateParams','$mdDialog', 'userStore', 'Dialog','$window','$state','toast','$http','$rootScope','$scope','friendsAPI'];

    function UserController(userResource, $stateParams ,$mdDialog, userStore,Dialog,$window,$state,toast, $http, $rootScope, $scope, friendsAPI) {
        var userCtrl = this;


        userResource.getUser($stateParams.id, function(data){
            /** get data **/
            $scope.$emit('newPageLoaded',{description:"View "+data.personaname+"'s "+"profile",title:data.personaname});
            userCtrl.user = data;

            if (userStore.user.hasOwnProperty('social') ) {                        // when logged in
                console.log(userStore.user);
                if (userStore.user.blocked) {
                    userCtrl.blocked = userStore.user.blocked.some(function (ea) {
                        return userCtrl.user.steamid == ea;
                    });

                    userCtrl.isblocked = userCtrl.user.blocked.some(function (ea) {
                        return userStore.user.steamid == ea;
                    });
                }


                userCtrl.canAddonSteam = !data.addSteamSetting;

                $scope.loggedinUser = userStore.user;

                if (userStore.user.social) {
                    userCtrl.cancel = userStore.user.social.friends.pending.sent.some(function (ea, i) {       // enable "cancel" button
                        console.log('do a check:' + userCtrl.user);
                        return ea.steamid == userCtrl.user.steamid;
                    });
                    userCtrl.friend = userStore.user.social.friends.list.some(function (ea, i) {                // enable "friend" status button
                        return ea.steamid == userCtrl.user.steamid;
                    });
                }

                userCtrl.canAddOnSteam = userCtrl.user.settings.user.addSteamSetting ? $scope.friend : true;    // reevaluate steam add button appearance/disappearance

                $scope.$watch('loggedinUser.social.friends.list', function (newValue) {                  // watch the object to update the "friend" and "cancel" buttons
                    if (newValue) {
                        userCtrl.friend = newValue.some(function (ea, i) {
                            return ea.steamid == userCtrl.user.steamid;
                        });
                    }
                });

                $scope.$watch('loggedinUser.social.friends.pending.sent', function (newValue) {
                    if (newValue) {
                        userCtrl.cancel = newValue.some(function (ea, i) {
                            return ea.steamid == userCtrl.user.steamid;
                        });
                    }
                });


            }

            /** button enable/disables **/

            userCtrl.friend = userStore.user.social ? userStore.user.social.friends.list.some(function (ea, i) {
                return ea.steamid == userCtrl.user.steamid;
            }) : false;


            if (userStore.user.social){                                                    // logged in
                userCtrl.canAddOnSteam = userCtrl.user.settings.user.addSteamSetting ? userCtrl.friend : true;     // if steam setting on or off
                userCtrl.canMsgOnSite = userCtrl.user.settings.user.msgOnSiteSetting ? userCtrl.friend : true;     // if msg setting on or off
            } else {
                userCtrl.canAddOnSteam = true;                                                                 // logged off
                userCtrl.canMsgOnSite = true;
            }

            /** end button enable/disables **/

            userResource.tempUserCache = data;   // used in msgCtrl;

            if (userCtrl.user.personal) {
                userCtrl.user.age = Math.floor((new Date() - new Date(userCtrl.user.personal.birthdate)) / (1000 * 60 * 60 * 24 * 365));
            }
            userCtrl.hasDota = userCtrl.user.ownedGames.some(function(ea){
                return ea.appid == "570"
            }) || userCtrl.user.recentlyPlayed.some(function(ea){
                return ea.appid == "570"
            });

            userCtrl.hasCSGO =  userCtrl.user.ownedGames.some(function(ea){
                return ea.appid == "730"
            }) || userCtrl.user.recentlyPlayed.some(function(ea){
                return ea.appid == "730"
            });

            userCtrl.rankURL = (function(){
                switch(userCtrl.user.csgo.rank) {
                    case "silver i":
                        return "/images/csgoranks/SI.png";
                    case "silver ii":
                        return "/images/csgoranks/SII.png";
                    case "silver iii":
                        return "/images/csgoranks/SIII.png";
                    case "silver iv":
                        return "/images/csgoranks/SIV.png";
                    case "silver elite":
                        return "/images/csgoranks/SE.png";
                    case "silver elite master":
                        return "/images/csgoranks/SEM.png";
                    case "gold nova i":
                        return "/images/csgoranks/GNI.png";
                    case "gold nova ii":
                        return "/images/csgoranks/GNII.png";
                    case "gold nova iii":
                        return "/images/csgoranks/GNIII.png";
                    case "gold nova master":
                        return "/images/csgoranks/GNM.png";
                    case "master guardian i":
                        return "/images/csgoranks/MGI.png";
                    case "master guardian ii":
                        return "/images/csgoranks/MGII.png";
                    case "master guardian elite":
                        return "/images/csgoranks/MGE.png";
                    case "distinguished master guardian":
                        return "/images/csgoranks/dmg";
                    case "legendary eagle":
                        return "/images/csgoranks/LE.png";
                    case "legendary eagle master":
                        return "/images/csgoranks/LEM.png";
                    case "supreme master first class":
                        return "/images/csgoranks/SMFC.png";
                    case "the global elite":
                        return "/images/csgoranks/GE.png";
                    default:
                        return "/images/csgoranks/UR.png";
                }
            })();

            /** functions **/

            userCtrl.goToState = goToState;

            userCtrl.addOnSteam = addOnSteam;

            userCtrl.sendComment = sendComment;

            userCtrl.openMsgForm = openMsgForm;

            userCtrl.addFriend = addFriend;

            userCtrl.cancelAddFriend = cancelAddFriend;

            userCtrl.removeFriend = removeFriend;

            userCtrl.blockUser = blockUser;

            userCtrl.reportUser = reportUser;

            userCtrl.unblockUser = unblockUser;

            function goToState(comment,$event){
                if (comment.settings.user.profilePrivacy){                    // if has privacy control enabled - flawed b/c a user can change settings but comment doesnt change
                    if (userStore.user.hasOwnProperty('settings')){             //if logged in
                        $state.go('user',{id:comment.authorpageid});
                    } else {                                                    // not logged in
                        var dialog = new Dialog.openModal($event,'','/partials/privacymodal');
                        return dialog.show();

                    }
                } else {
                    $state.go('user',{id:comment.authorpageid});
                }
            }

            function addOnSteam(url,$event){
                if (userStore.user.hasOwnProperty('settings')){
                    toast.triggerToast({},'Added successfully. Check your Steam client.','userController as userCtrl','success-toast','.user-toast', 3000);
                    return  $window.location.href=url;
                } else {
                    var modal = new Dialog.openModal($event,'','/partials/loginmodal');
                    return modal.show();
                }
            }

            function sendComment(text,$event){
                console.log('sent message')

                if (userCtrl.isblocked){
                    modal = new Dialog.openModal($event,'messageController as msgCtrl','/partials/blockedmodal');
                    return modal.show();
                }

                var modal;
                if (!text){
                    return;                                                   // we dont watn empty comments.
                }

                if (!userStore.user){
                    modal = new Dialog.openModal($event,'messageController as msgCtrl','/partials/loginmodal');
                    return modal.show();
                }

                if (!userStore.user.hasOwnProperty('settings')){
                    modal = new Dialog.openModal($event,'messageController as msgCtrl','/partials/loginmodal');
                    return modal.show();

                }

                var postData = {
                    avatarmedium: userStore.user.avatarmedium,
                    authorid: userStore.user.steamid,
                    author: userStore.user.personaname,
                    authorpageid: userStore.user.userPageID,
                    submitted: new Date(),
                    profileurl: userStore.user.profileurl,
                    comment:text,
                    sentto: data.steamid,
                    settings : userStore.user.settings
                };

                userResource.sendComment(postData,data.steamid,function(){
                    userCtrl.body = '';
                    userCtrl.sentcomment = !userCtrl.sentcomment;
                    userCtrl.user.comments.push(postData);
                },function(){

                })
            }

            function openMsgForm($event, comment){
                console.log(userCtrl.isblocked);
                var dialog;

                if (userCtrl.isblocked){
                    dialog = new Dialog.openModal($event,'messageController as msgCtrl','/partials/blockedmodal');
                    return dialog.show();
                }

                if (!userStore.user.hasOwnProperty('settings')){
                    dialog = new Dialog.openModal($event,'messageController as msgCtrl','/partials/loginmodal');
                    return dialog.show();
                }

                if (comment) {
                    comment.block = comment.block || [];
                    var blocked = comment.blocked.some(function(ea){
                        return userStore.user.steamid == ea;
                    });

                    if (blocked){
                        dialog = new Dialog.openModal($event,'messageController as msgCtrl','/partials/blockedmodal');
                        return dialog.show();
                    }
                    userResource.tempCommentUserCache = comment;
                    if (userStore.user.steamid == comment.authorid) {
                        dialog = new Dialog.openModal($event, 'messageController as msgCtrl', '/partials/cannotmsgself');
                        return dialog.show();
                    }
                }

                dialog = new Dialog.openModal($event,'messageController as msgCtrl','/partials/messagewindow',function(){
                    userResource.tempCommentUserCache= {};
                });
                dialog.show().then(function(){
                    toast.triggerToast({},'Message sent.','userController as userCtrl','success-toast','.user-toast', 3000);
                })
            }

            function addFriend(user, $event) {             // 'e' is $event
                if (userStore.user.hasOwnProperty('settings')) {
                    userCtrl.cancel = !userCtrl.cancel;
                    return $http.post('/users/addfriend/' + user.steamid)
                        .then(function (data) {
                            /* var element = angular.element(event.currentTarget);       // select the element that triggered the event (in this case is the add friend button)*/
                            userStore.user.social.friends.pending.sent.push(data.data);
                            $rootScope.$broadcast('newsentfriend');
                            toast.triggerToast({}, 'Request sent.', 'usersController as usersCtrl', 'success-toast', '.user-toast', 3000);
                        }, function errorCallback(err) {
                            console.log('here is the error:' + JSON.stringify(err));
                        })
                }

                var dialog = new Dialog.openModal($event, '', '/partials/loginmodal');
                return dialog.show();
            }

            function cancelAddFriend(user) {
                userCtrl.cancel = !userCtrl.cancel;
                $http.get('/users/canceladdfriend/' + user.steamid)
                    .then(function () {
                        var sent = userStore.user.social.friends.pending.sent;
                        sent.some(function (ea, i) {
                            if (ea.steamid == user.steamid) {
                                return sent.splice(i, 1);
                            }
                        });
                        $rootScope.$broadcast('requestcancel')
                        toast.triggerToast({}, 'Request Cancelled.', 'usersController as usersCtrl', 'success-toast', '.user-toast', 3000);
                    }, function errorCallback(err) {
                        console.log(err);
                    })
            }

            function removeFriend (user) {
                userCtrl.friend = !userCtrl.friend;
                friendsAPI.loopAndRemove(userStore.user.social.friends.groups, user);
                friendsAPI.removeFriend(user);
                toast.triggerToast({}, 'Friend Removed','friendsController','success-toast','.user-toast',3000);
            }

            function blockUser (user){
                $http.post('/users/blockuser/' + user.steamid)
                    .then(function(){
                        userCtrl.blocked = !userCtrl.blocked;
                    })
            }

            function unblockUser(user){
                $http.post('/users/unblockuser/' + user.steamid)
                    .then(function(){
                        userCtrl.blocked = !userCtrl.blocked;
                    })
            }

            function reportUser (user){

            }

            userCtrl.closeNotice = function(){
                userCtrl.sentcomment = !userCtrl.sentcomment;
            }
        },function(){
            userCtrl.error = !userCtrl.error;
        })
    }
})();



