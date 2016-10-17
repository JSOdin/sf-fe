(function(){
    'use strict';

    angular.module('myapp').filter('allFilter', AllFilter);

    AllFilter.$inject = [];

    function AllFilter(){                                                  // must often check for existence of "arr" because $digest cycle runs before the controller data is filled (the arr)
        return function (arr) {
            return arr.filter(function(ea){
               if (ea.value != 'all'){
                   return ea;
               }
            });
        }
    }
})();