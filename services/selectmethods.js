(function(){
    'use strict';

    angular.module('myapp').factory('selectmethods',[SelectMethods]);

    function SelectMethods(){
        return {
            mapToObj: mapToObj,
            createQueryResults: createQueryResults
        };

        function mapToObj(arr, includeAll, objType){
            var result;
            if (objType){
                result = arr.map(function(ea){
                    return {
                        value: ea.name.toLowerCase(),
                        display: ea.name,
                        appid: ea.appid,
                        fields: ea.fields
                    }
                });

                if (includeAll) {
                    result.push({
                        value: 'all',
                        display: 'All'
                    });
                }
                result.sort(function(a,b){
                    a.value.toLowerCase();
                    b.value.toLowerCase();
                   if (a<b){
                       return -1;
                   } else if (a>b){
                       return 1;
                   } else {
                       return 0;
                   }
                });
                return result;
            }

            result = arr.map(function(ea){
                return {
                    value: ea.toLowerCase(),
                    display: ea
                }
            });
            if (includeAll) {
                result.push({
                    value: 'all',
                    display: 'All'
                });
            }
            return result
        }

        function createQueryResults(searchterm,arr){
            return searchterm ? arr.filter(createFilterFor(searchterm)):arr;
        }

        function createFilterFor(query){
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(ea){
                return (ea.value.indexOf(lowercaseQuery) >= 0);
            }
        }
    }
})();