(function(){
    'use strict';

    angular.module('myapp').factory('paginationCache',PaginationCache);

    PaginationCache.$inject = [];

    function PaginationCache(){
        return {
            currentPage: 1,
            direction: "",
            itemsShown:0,
            totalItems:0
        }
    }
})();