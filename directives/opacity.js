(function(){
    'use strict';

    // opacity directive is placed in games.ejs on the outermost element.  the attribute's value is set to gamesCtrl.apps
    // when user changes the ng-model="search" by typing, the first watch listener is called, removing previously
    // existing animation classes and dimming the panels. then the server is called, client receives data, and
    // gamesCtrl.apps changes. when that happens in gameCtrl.js, trigger the listener in this directive because
    // attrs.opacity changes

    angular.module('myapp').directive('opacity',Opacity);

    Opacity.$inject = [];

    function Opacity(){
        return {
            link: function(scope,element,attrs,controller){
                scope.$watch(attrs.modelcopy, function(newValue,oldValue){
                    if (newValue == oldValue){
                        return;
                    }
                    var elements = angular.element($('.game-repeat-blocks'));
                    elements.removeClass('game-panels-add-opacity-on-enter');
                    elements.removeClass('game-panels-vanish-when-data-zero');

                    elements.addClass('game-panels-add-opacity');
                });

                scope.$watch(attrs.opacity, function(newValue, oldValue){
                    if (newValue == oldValue){
                        return;
                    }
                    var elements = angular.element($('.game-repeat-blocks'));
                    if (newValue.length != 0) {
                        elements.addClass('game-panels-add-opacity-on-enter');
                    } else {
                        elements.addClass('game-panels-vanish-when-data-zero');
                    }
                })
            }
        }
    }
})();