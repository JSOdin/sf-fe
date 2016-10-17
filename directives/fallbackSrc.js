(function() {

   'use strict';

    angular.module('myapp').directive('fallbackSrc', FallbackSrc);

    FallbackSrc.$inject = [];

    function FallbackSrc() {
        return {
            link: function fallbackLink(scope, element, attrs) {
                element.bind('error', function () {

                    element.attr('src', attrs.fallbackSrc);
                    if (attrs.gamePanelFallback){
                        return element.attr('style', 'width:100%; position:absolute; top:0; left: 0; opacity: 0.8; height:117px;' )
                    }
                    element.attr('style', 'width:100%; height:60px;')
                })
            }
        }
    }
})();