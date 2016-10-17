(function(){
    'use strict';

    angular.module('myapp').filter('filterAgeByRange', FilterAgeByRange);

    FilterAgeByRange.$inject = [];

    function FilterAgeByRange(){
        return function (arr, ageRange) {
            return arr? arr.filter(function (ea) {
                var regex = /^A/i;

                if (ageRange.match(regex) || !ageRange) {
                    return ea;
                }

                var splitRegex = /-|\+/;
                var endPoints = ageRange.split(splitRegex);
                if (ea.personal) {
                    var calculatedAge = Math.floor((new Date() - new Date(ea.personal.birthdate)) / (1000 * 60 * 60 * 24 * 365));
                    if (!endPoints[1]) {
                        return calculatedAge > +endPoints[0];
                    }
                }

                if (endPoints[1]){
                    return calculatedAge >= +endPoints[0] && calculatedAge <= +endPoints[1];
                }
            }): arr;
        }
    }
})();