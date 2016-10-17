(function() {
    'use strict';

    angular.module('myapp').filter('orderBySubmitted', OrderBySubmitted);

    OrderBySubmitted.$inject=[];

    function OrderBySubmitted() {                                                      //custom filters for ng-repeat is passed in the ENTIRE array, not individual items.
        return function(arr) {                                                                      // order the conversations by which has the latest message
            if (arr){
                var toSort = arr;

                toSort.sort(function(a,b){
                    if (a.hasOwnProperty('submitted')){
                        return new Date(b.submitted)-new Date(a.submitted);
                    } else {
                        return new Date(b.time)-new Date(a.time);
                    }
                });

                return toSort;
            }
        }
    }
})();