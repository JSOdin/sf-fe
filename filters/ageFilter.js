(function () {
    'use strict';

    angular.module('myapp').filter('ageFilter', AgeFilter);

    AgeFilter.$inject = [];

    function AgeFilter() {    // User is the angular constant

        return function (input) {
            if (input){
                return Math.floor((new Date()-new Date(input))/(1000*60*60*24*365));
            } else {
                return '';
            }
        }
    }
})();
