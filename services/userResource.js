(function () {
    'use strict';

    angular.module('myapp').factory('userResource', UserResource);

    UserResource.$inject = ['$resource'];

    function UserResource ($resource) {
        var REST = $resource('/users/:action/:id', {id: '@id', action: '@action'}, {
            postMsg: {method: 'POST'},
            getConvos: {method: 'GET', isArray: true},
            getNotices:{method:'GET',isArray:true},
            getConvo: {method: 'GET'},
            readConvo: {method: 'POST'},
            replyToConvo: {method: 'POST'},
            deleteconvo: {method: 'POST'},
            sendcomment: {method: 'POST'},
            deleteallconvos: {method: 'POST'},
            sendgamesuggestion: {method: 'POST'},
            contactus: {method:'POST'},
            triggerSetting: {method:'POST'},
            submitpost:{method:'POST'}
        });

        return {
            submitPost : function(id,postData,cb,errcb){
                return REST.submitpost({id:id,action:'submitpost'},postData,cb,errcb);
            },
           /* getOwnedGames: function (id, cb) {
                return REST.get({id: id, action: 'getownedgames'}, cb);
            },*/
            getUser: function (id, cb,cache,errcb) {
                var cacheMode = cache ? cache: false;
                return REST.get({id: id, cache:cacheMode,action: 'fetchuser'}, cb,errcb);
            },
            tempUserCache: {},
            tempCommentUserCache: {},
            sendMessage: function (postData, steamid, cb) {
                return REST.postMsg({id: steamid, action: 'sendmessage'}, postData, cb);
            },
            getConvos: function (steamid, cb) {
                return REST.getConvos({id: steamid, action: 'fetchconvos'}, cb);
            },
            getConvo: function (id, cb) {
                return REST.getConvo({id: id, action: 'fetchconvo'}, cb);
            },
            replyToConvo: function (postData, id, cb) {
                return REST.replyToConvo({id: id, action: 'replytoconvo'}, postData, cb);
            },
            deleteconvo: function (postData, id, cb) {
                return REST.deleteconvo({id: id, action: 'deleteconvo'}, postData, cb);
            },
            sendComment: function (postData, id, cb, errcb) {
                return REST.sendcomment({id: id, action: 'sendcomment'}, postData, cb, errcb);
            },
            deleteAllConvos: function (steamid, cb, errcb) {
                return REST.deleteallconvos({id: steamid, action: 'deleteallconvos'}, {}, cb, errcb);
            },
            sendGameSuggestion: function (postData, cb, errcb) {
                return REST.sendgamesuggestion({id: '', action: 'sendgamesuggestion'}, postData, cb, errcb);
            },
            getNotices:function(steamid,cb){
                return REST.getNotices({id:steamid, action:'getnotices'},cb);
            },
            contactUs:function(postData,cb,errcb){
                return REST.contactus({id:'',action:'contactus'},postData,cb,errcb);
            },
            triggerSetting:function(postData,cb,errcb){
                return REST.triggerSetting({id:'',action:'triggersetting'},postData,cb,errcb);
            }
        }
    }
})();