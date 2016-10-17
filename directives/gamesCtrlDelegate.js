(function(){                                                            // need this extra directive because gamescontroller was being called twice due to
    'use strict';                                                        // the controller being tied to the 'main' state in app.js and the pagination directive declaring
                                                                        // the same controller (but its own instance, hence calling twice)


    angular.module('myapp').directive('gamesCtrlDelegate', GamesctrlDelegate);

    GamesctrlDelegate.$inject =[];

    function GamesctrlDelegate(){
        return {
            restrict: 'A',
            controller: 'gamesController as gamesCtrl'
        }
    }
})();