(function(){
    'use strict';

    angular.module('myapp').controller('singlepostController', SingleController);

    SingleController.$inject = ['$http','$scope','$window'];

    function SingleController($http,$scope,$window){
        var self = this;

        self.goback = function(){
            $window.history.back();
        }
    }
})();