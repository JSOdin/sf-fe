(function(){
    'use strict';

    angular.module('myapp').factory('savestateService',SavestateService);

    SavestateService.$inject = ['$resource'];

    function SavestateService(){
        return {
            scope:''
        }
    }
})();