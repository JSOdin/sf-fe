(function(){
    'use strict';

    angular.module('myapp').filter('timeAgoFilter',TimeAgoFilter);

    TimeAgoFilter.$inject=[];

    function TimeAgoFilter(){
        return function(messages){
            if (messages) {
                var msgs = messages;
                msgs.sort(function (a, b) {                                                    // get the most recent message
                    return new Date(a.submitted) - new Date(b.submitted);
                });

                return (msgs[msgs.length-1]);
            }
        }
    }
})();