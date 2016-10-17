(function(){                                                            // need this extra directive because userscontroller was being called twice due to
    'use strict';                                                        // the controller being tied to the 'main' state in app.js and the pagination directive declaring
    // the same controller (but its own instance, hence calling twice)

    angular.module('myapp').directive('usersCtrlDelegate', UsersctrlDelegate);

    UsersctrlDelegate.$inject = [];

    function UsersctrlDelegate(){
        return {
            restrict: 'A',
            link: function(scope){

            },
            controller: 'usersController as usersCtrl'
        }
    }
})();