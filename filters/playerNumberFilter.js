(function () {
    'use strict';

    angular.module('myapp').filter('playerNumber', PlayerNumber);

    PlayerNumber.$inject=[];

    function PlayerNumber () {
        return function (input) {
            return input.filter(function (ea, i, arr) {
                return ea.currentPlayers > 10000;
            });
        };
    }
})();