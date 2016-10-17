(function() {

    'use strict';

    angular.module('myapp').directive('gamePanel', GamePanel);

    GamePanel.$inject = ['$state'];

    function GamePanel($state) {
        return {
            restrict: 'E',
            scope: {
                game: '=',
                index: '='
            },
            replace: true,
            templateUrl: 'directives/gamePanel.html',
            link: function (scope, element, attrs) {
                element.bind('click',function(){
                    $state.go('searchbygame',{game:attrs.gamename})
                });

                element.bind('mouseenter', function () {
                    element.addClass(attrs.highlightClass);
                });

                element.bind('mouseleave', function () {
                    element.removeClass(attrs.highlightClass);
                });

             /*   element.css({
                   'background-image': 'url(http://cdn.akamai.steamstatic.com/steam/apps/'+scope.game.appid+'/header.jpg)',
                    'background-size':'100%',
                    'background-repeat':'no-repeat'
                });*/
            }
        }
    }
})();