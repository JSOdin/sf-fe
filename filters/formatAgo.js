(function(){
    'use strict';

    angular.module('myapp').filter('formatAgo',FormatAgo);

    FormatAgo.$inject=[];

    function FormatAgo(){
        return function(message){
            if (message) {
                message = message.submitted ? message.submitted : message;

                var difference = (new Date() - new Date(message)) / 1000;  // seconds
                var statement, days;

                if (difference < 60) {
                    difference = Math.floor(difference);
                    statement = difference == 1 ? difference + ' second ' : difference + ' seconds ';
                } else if (difference >= 60 && difference < 3600) {
                    statement = Math.floor(difference / 60) == 1 ? Math.floor(difference / 60) + ' minute ' : Math.floor(difference / 60) + ' minutes ';
                } else if (difference >= 3600 && difference < 24 * 3600) {                               // 1 hour - less than 1 day
                    var minutes = Math.floor((difference % 3600) / 60);
                    var hours = Math.floor(difference / 3600);
                    var minuteStatement = !(difference % 3600) ? '' : (minutes == 1) ? minutes + ' minute ' : minutes + ' minutes ';
                    var hourStatement = Math.floor(difference / 3600) == 1 ? hours + ' hour ' : hours + ' hours ';
                    statement = hourStatement + minuteStatement;
                } else if ((difference >= 24 * 3600) && (difference < 24 * 3600 * 7)) {                          // 1 day - less than a week
                    days = Math.floor(difference / (24 * 3600));
                    statement = days == 1 ? days + ' day ' : days + ' days ';
                } else if (difference >= 24 * 3600 * 7 && difference < 24 * 3600 * 30) {                          // 1 week - less than 1 month
                    days = Math.floor(difference % (24 * 3600 * 7) / (24 * 3600));                              // this was causing days to display wrong
                    var dayStatement = !days ? '' : days == 1 ? days+' day ' : days + ' days ';
                    var weeks = Math.floor(difference / (24 * 3600 * 7));
                    var weekStatement = weeks == 1 ? weeks + ' week ' : weeks + ' weeks ';
                    statement = weekStatement + dayStatement;
                } else if (difference >= 24 * 3600 * 30 && difference < 24 * 3600 * 365) {                        // 1 month - less than 1 year
                    var months = Math.floor(difference / (24 * 3600 * 30));
                    statement = months == 1 ? months + ' month ' : months + ' months ';

                } else {                                                                                 // 1 year and beyond
                    var years = Math.floor(difference / (24 * 3600 * 365));
                    statement = years == 1 ? years + ' year ' : years + ' years ';

                }

                return statement + 'ago';
            }
        }
    }
})();