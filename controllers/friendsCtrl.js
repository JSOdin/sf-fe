(function() {

    'use strict';

    angular.module('myapp').controller('friendsController', FriendsController);

    FriendsController.$inject = ['userStore', '$scope', '$http', '$state', 'userResource','friendsAPI', 'Dialog','toast'];

    function FriendsController(userStore, $scope, $http, $state, userResource, friendsAPI,Dialog,toast) {
        var friendsCtrl = this,
            allfriendgroup;

        /** get data **/

        userResource.getUser('refreshuser',function(data){
            friendsCtrl.user = data;
            userStore.user.general = data.general;
            userStore.user.personal = data.personal;

            userStore.user.notifications = data.notifications;
            userStore.user.conversations = data.conversations;
            userStore.user.settings = data.settings;
            userStore.user.social = data.social;
            userStore.user.blocked = data.blocked;
            userStore.user.comments = data.comments;

            allfriendgroup = {
                name: 'All Friends',
                list: data.social.friends.list
            };

            /** first section **/

            friendsCtrl.groups = data.social.friends.groups.list.length == 0 ? [allfriendgroup] : [allfriendgroup].concat(data.social.friends.groups.list);  // all friend groups data

            friendsCtrl.groupnames = friendsCtrl.groups.map(function (ea) {                                                                                           // collection of group names only.
                return ea.name;
            });

            /** second, right section **/

            friendsCtrl.pending = {};

            friendsCtrl.pending.received = data.social.friends.pending.received;

            friendsCtrl.pending.sent = data.social.friends.pending.sent;
        });

        /** first section methods **/

        friendsCtrl.addToFriendGroups = addToFriendGroups;

        friendsCtrl.addToGroup = addToGroup;

        friendsCtrl.deleteFromGroup = deleteFromGroup;

        friendsCtrl.deleteGroup = deleteGroup;

        /** second section methods **/

        friendsCtrl.acceptFriend = acceptFriend;

        friendsCtrl.gotoState = gotoState;

        friendsCtrl.cancelRequest = cancelRequest;

        friendsCtrl.removeFriend = removeFriend;

        friendsCtrl.refuseRequest = refuseRequest;

        friendsCtrl.openMenu = openMenu;

        friendsCtrl.openMsgForm = openMsgForm;

        /** event listeners **/

/*
        var watcher = $scope.$on('userfetched',function(){                                                                                                                        // fake real time updating
            refreshDOM();
            watcher();
        });*/

        $scope.$on('newsentfriend', function () {                                                                      /** from users page userpanel **/
            friendsCtrl.pending.sent = userStore.user.social.friends.pending.sent;
        });

        $scope.$on('requestcancel',function(){
            friendsCtrl.pending.sent = userStore.user.social.friends.pending.sent;
        });

        /** all methods **/

     /*   function getData(){
            userResource.getUser('refreshuser', function (thisuser) {                                      // asynchronously get user data and refresh the DOM when in friends state. this is
                // so you can actively receive new friend requests when u land on this state.
                                                                                                        // also prevent wobbling of the DOM because there is already data before rendering completely.

                refreshDOM();                                                                          // one more thing, when u get to friends state without browser refresh, allow updating of data from server.
            });
        }

        function refreshDOM(){
            if (userStore.user.social) {
                allfriendgroup = {
                    name: 'All Friends',
                    list: userStore.user.social.friends.list
                };
                friendsCtrl.groups = userStore.user.social.friends.groups.list.length == 0 ? [allfriendgroup] : [allfriendgroup].concat(userStore.user.social.friends.groups.list);
                friendsCtrl.groupnames = friendsCtrl.groups.map(function (ea) {
                    return ea.name;
                });
                friendsCtrl.pending = {};
                friendsCtrl.pending.received = userStore.user.social.friends.pending.received;
                friendsCtrl.pending.sent = userStore.user.social.friends.pending.sent;
            }
        }*/

        function addToFriendGroups(groupname){
            var checkExist = friendsCtrl.groups.some(function(ea,i){
                return ea.name == groupname
            });

            if (checkExist){
                return toast.triggerToast({}, 'Duplicate group names are not allowed.','friendsController','warning-toast','.friends-toast',3000);
            }
            var group = {
                name: groupname,
                list:[]
            };
            friendsCtrl.groups.push(group);

            friendsCtrl.groupnames.push(groupname);
            friendsCtrl.groupname = '';            // the ng-model for group name input
            friendsAPI.addFriendGroup(group,userStore.user);
            toast.triggerToast({}, 'New group added.','friendsController','success-toast','.friends-toast',3000);
        }

        function deleteGroup(groupname){
            friendsAPI.deleteGroup(groupname, function(){
                friendsCtrl.groups.some(function(ea,i){
                    if (groupname == ea.name){
                        return friendsCtrl.groups.splice(i,1);
                    }
                });

                friendsCtrl.groupnames.some(function(ea,i){
                    if (groupname == ea){
                        return friendsCtrl.groupnames.splice(i,1);
                    }
                });
            });

            toast.triggerToast({}, 'Group deleted.','friendsController','success-toast','.friends-toast',3000);
        }

        function addToGroup(name,friend){
            var canInsert = friendsCtrl.groups.slice(1).some(function(ea,i){
                var duplicateExist = ea.list.some(function(val){
                    return val.steamid == friend.steamid
                });

                if (ea.name == name && !duplicateExist){
                    friendsCtrl.groups.slice(1)[i].list.push(friend);                                       // if you slice something that has embedded arrays and do something to the
                                                                                                            // slice, it affects the original object (slice() itself still does not.)
                    return true;
                }
            });

            if (canInsert){
                friendsAPI.addToGroup(name,friend);
                toast.triggerToast({},'Friend added to group.','friendsController',"success-toast",'.friends-toast',3000)

            } else {
                toast.triggerToast({},'Friend is already in this group.','friendsController','warning-toast','.friends-toast',3000);
            }
        }

        function deleteFromGroup(name,friend){
            friendsCtrl.groups.forEach(function(ea,i){
                if (ea.name == name){
                    ea.list.forEach(function(val,j){
                        if (val.steamid == friend.steamid){
                            friendsCtrl.groups[i].list.splice(j,1);
                        }
                    });
                }
            });

            friendsAPI.deleteFromGroup(name,friend);
            toast.triggerToast({}, 'Friend Deleted from Group','friendsController','success-toast','.friends-toast',3000);
        }

        function acceptFriend (user) {
            friendsAPI.loopAndRemove(friendsCtrl.pending.received, user,true);
            friendsAPI.acceptFriend(friendsCtrl.user, user);
            userStore.user.social.friends.pending.received = friendsCtrl.pending.received;
            userStore.user.social.friends.list = friendsCtrl.groups[0].list;
            toast.triggerToast({}, 'Friend Accepted','friendsController','success-toast','.friends-toast',3000);
        }

        function gotoState(state) {
            $state.go(state);
        }

        function cancelRequest (user) {
            friendsAPI.loopAndRemove(userStore.user.social.friends.pending.sent, user, true);
            friendsCtrl.pending.sent = userStore.user.social.friends.pending.sent;
            friendsAPI.cancelRequest(user);
            toast.triggerToast({}, 'Request Cancelled','friendsController','success-toast','.friends-toast',3000);
        }

        function removeFriend (user) {
            friendsAPI.loopAndRemove(friendsCtrl.groups, user);
            friendsAPI.removeFriend(user);
            userStore.user.social.friends.list = friendsCtrl.groups[0].list;
            toast.triggerToast({}, 'Friend Removed','friendsController','success-toast','.friends-toast',3000);
        }

        function refuseRequest (user) {
            friendsAPI.loopAndRemove(userStore.user.social.friends.pending.received, user,true);
            friendsCtrl.pending.received = userStore.user.social.friends.pending.received;
            friendsAPI.refuseRequest(user);
            toast.triggerToast({}, 'Request Refused','friendsController','success-toast','.friends-toast',3000);
        }

        function openMenu($mdOpenMenu, $event){
            $mdOpenMenu($event);
        }

        function openMsgForm($event, comment,user){
            userResource.tempUserCache = user;
            var msgwindow;
            if (!userStore.user){
                msgwindow = new Dialog.openModal($event,'messageController as msgCtrl','/partials/loginmodal');
                return msgwindow.show();
            }

            if (!userStore.user.hasOwnProperty('settings')){
                msgwindow = new Dialog.openModal($event,'messageController as msgCtrl','/partials/loginmodal');
                return msgwindow.show();
            }

            var dialog = new Dialog.openModal($event,'messageController as msgCtrl','/partials/messagewindow',function(){
                userResource.tempCommentUserCache= {};
            });
            dialog.show();

            if (comment) {
                userResource.tempCommentUserCache = comment;
            }
        }

    }
})();