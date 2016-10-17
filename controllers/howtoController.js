/**
 * Created by Jaesung on 06/12/2015.
 */
(function() {

    'use strict';

    angular.module('myapp').controller('howtoController', HowtoController);

    HowtoController.$inject = ['userStore','$scope'];

    function HowtoController(userStore, $scope) {
        var howCtrl = this;
        howCtrl.loggedin = userStore.user.hasOwnProperty('settings');

       /* (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5&appId=659548270853016";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        window.twttr = (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0],
                t = window.twttr || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js, fjs);

            t._e = [];
            t.ready = function(f) {
                t._e.push(f);
            };

            return t;
        }(document, "script", "twitter-wjs"));*/

       /* var title =  angular.element(document.querySelector('#main-title'));

        title.html("Steam Friends - Find a Steam Friend with Ease");*/

        $scope.$emit('newPageLoaded',{description:'Steam Friends is a platform that helps you easily search for new friends to play games with. Make a post, or look through the users directory.',title:'Steam Friends - Find The Perfect Gaming Buddy'});
    }
})();
