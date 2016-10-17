(function(){
    'use strict';

    angular.module('myapp').directive('searchform',Searchform);

    Searchform.$inject = [];

    function Searchform(){
        return {
            restrict:'E',
            replace:true,
            templateUrl:'directives/searchform.html'
        }
    }
})();