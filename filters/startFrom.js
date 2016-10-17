(function(){                                                                    // pagination filter
    'use strict';

    angular.module('myapp').filter('startFrom',StartFrom);

    StartFrom.$inject=[];

    function StartFrom(){
        return function(arr, args){
            if (arr) {
                return args ? arr.slice(args[0] * args[1]) : arr;           // for any given page the start is currentpage * pagesize + 1.  e.g. first page ==> 1 is first value.
            }
        }
    }
})();