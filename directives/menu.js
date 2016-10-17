(function() {
    'use strict';

    angular.module('myapp').directive('menu', Menu);

    Menu.$inject = ['$state', 'userStore', '$cacheFactory'];

    function Menu($state, userStore, $cacheFactory) {
        return {
            restrict: 'E',
            replace:true,
            scope:{
                loggedin: '=',
                hidemenu: '='
            },
            templateUrl: 'directives/menu.html',
            link: function (scope, element, attrs) {
                scope.game = $cacheFactory.get('myCache').get('lastGameFormSearched');
                scope.gotoState = function (state,param) {

                    if (param){
                        return $state.go(state,{game:param})
                    }
                    $state.go(state);
                };


            }
        }
    }
})();