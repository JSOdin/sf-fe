(function () {

    'use strict';

    angular.module('myapp').filter('noticemessage', noticeMessage);

    noticeMessage.$inject=[];
    function noticeMessage() {
        return function (input) {
             if (input == 'friendadd'){
                 return 'has sent you a friend request.';
             }

             if (input == 'comment'){
                 return 'has posted a comment on your profile page.';
             }
        }
    }
})();
