(function() {
    'use strict';

    angular.module('myapp').filter('imgfilter',ImgFilter);

    ImgFilter.$inject = [];


    function ImgFilter () {                                                      //custom filters for ng-repeat is passed in the ENTIRE array, not individual items.
        return function (gamesArray) {
            if (gamesArray) {
                return gamesArray.filter(function (ea, i) {
                    return ea.img_logo_url;                                                 //we are filtering out games that have img logo urls.
                })
            }
        }
    }
})();