(function(){
    'use strict';

    angular.module('myapp').factory('postResource',PostFactory);

    PostFactory.$inject = ['$resource'];

    function PostFactory($resource){
        var REST = $resource('/posts/:action/:searchterm', {searchterm: '@searchterm',action:'@action'},{checkPasscode:{method:'POST'},memberBump:{method:'POST'},memberEditAndBump:{method:'POST'},filterPosts:{method:'POST',isArray:true}});

        return {
            getFrontPage: function(cb,errcb){
                return REST.query({searchterm:'',action:'fetchposts'},cb,errcb);
            },
            manageSinglePost: function(id,cb,errcb){
                return REST.get({searchterm:id,action:'getsinglepost'},cb,errcb);
            },
            checkPasscodeBump: function(id,postData,cb,errcb){
                return REST.checkPasscode({searchterm:'', action:'checkpasscodebump'}, postData ,cb ,errcb);
            },
            memberBump: function(id,cb,errcb){
                return REST.memberBump({searchterm:id, action:'memberbump'},cb,errcb);
            },
            memberEditAndBump: function(id,postData,cb,errcb){
                return REST.memberEditAndBump({searchterm:id,action:'membereditandbump'},postData,cb,errcb);
            },
            filterPosts:function(postData,pagination,cb,errcb){
                return REST.filterPosts({searchterm:pagination,action:'filterposts'},postData,cb,errcb);
            },
            captchaWIdget:''    /** captcha widget ID saved here **/
        };
    }
})();