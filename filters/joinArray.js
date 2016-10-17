(function () {

    'use strict';

    angular.module('myapp').filter('joinArray', JoinArray);

    JoinArray.$inject=[];
    function JoinArray() {
        return function (input) {
            return input.join(', ');
        }
    }
})();
