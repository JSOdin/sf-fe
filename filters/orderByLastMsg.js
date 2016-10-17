(function() {
    'use strict';

    angular.module('myapp').filter('orderByLastMsg', OrderByLastMsg);

    OrderByLastMsg.$inject=[];

    function OrderByLastMsg() {                                                      //custom filters for ng-repeat is passed in the ENTIRE array, not individual items.
        return function(arr) {                                                                      // order the conversations by which has the latest message
            if (arr) {
                var sorted = arr;
                sorted.sort(function (a, b) {
                    var msgssortedA = a.messages;
                    var msgssortedB = b.messages;
                    msgssortedA.sort(function (i, j) {
                        return new Date(j.submitted) - new Date(i.submitted);
                    });

                    msgssortedB.sort(function (k, l) {
                        return new Date(l.submitted) - new Date(k.submitted);
                    });

                    return new Date(msgssortedB[0].submitted) - new Date(msgssortedA[0].submitted);
                });
                return sorted;
            }
        }
    }
})();