(function(){
    'use strict';

    angular.module('myapp').factory('friendsAPI', FriendsAPI);

    FriendsAPI.$inject = ['$http'];

    function FriendsAPI($http){
        return {
            acceptFriend: acceptFriend,
            cancelRequest: cancelRequest,
            removeFriend: removeFriend,
            refuseRequest: refuseRequest,
            loopAndRemove: loopAndRemove,
            addFriendGroup: addFriendGroup,
            addToGroup: addToGroup,
            deleteFromGroup: deleteFromGroup,
            deleteGroup: deleteGroup
        };

        function deleteGroup(groupname,cb){
            var postData = {
               groupname: groupname
            };
            $http.post('/users/deletegroup/',postData).then(function(){
                cb();
            }, function errorCallback(err) {
                console.log(err);
            })
        }

        function acceptFriend(thisuser, user){
            $http.post('/users/acceptfriend/' + user.steamid)
                .then(function () {
                    thisuser.social.friends.list.push(user);
                }, function errCallback(err) {
                    console.log(err);
                })
        }

        function cancelRequest(user){
            $http.get('/users/canceladdfriend/' + user.steamid)
                .then(function () {
                }, function errorCallback(err) {
                    console.log(err);
                })
        }

        function removeFriend(user){
            $http.post('/users/removefriend/' + user.steamid)
                .then(function () {

                }, function errorCallback(err) {
                    console.log(err);
                })
        }

        function addFriendGroup(postData,user){

            $http.post('/users/addfriendgroup/'+user.steamid, postData
            ).then(function(){

                },function errorCallback(err){
                    console.log(err);
                })

        }

        function addToGroup(name,friend){
            var postData = {
                groupname: name,
                friend: friend
            };

            $http.post('/users/addtogroup/',postData)
                .then(function(){

                },function errorCallback(err){
                    console.log(err);
                })
        }

        function deleteFromGroup(name,friend){
            var postData = {
                groupname: name,
                friend:friend
            };

            $http.post('/users/deletefromgroup/',postData)
                .then(function(){

                },function errorCallback(err){
                    console.log(err);
                })
        }

        function refuseRequest(user){
            $http.post('/users/refuserequest/' + user.steamid)
                .then(function () {

                }, function errorCallback(err) {
                    console.log(err);
                })
        }

        function loopAndRemove(list, user,isPending)                       // TODO implement server side friend group adding/deleting and friend adding to those groups.
        {
            if (isPending){
                return angular.forEach(list, function (ea, i) {
                    if (ea.steamid == user.steamid) {
                        list.splice(i, 1);
                    }
                });
            }
            angular.forEach(list,function(eachList,i){
                angular.forEach(eachList.list, function (ea, i) {
                    if (ea.steamid == user.steamid) {
                        eachList.list.splice(i, 1);
                    }
                });
            });
        }
    }
})();