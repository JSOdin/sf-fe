(function() {

    'use strict';

    angular.module('myapp').directive('spinneronload', SpinnerOnLoad);

    SpinnerOnLoad.$inject = [];

    function SpinnerOnLoad() {
        return {
            restrict: 'A',
            link: function Spinner(scope, element, attrs) {
                element.on('load', function() {
                    // Set visibility: true + remove spinner overlay
                    element.removeClass('spinner-show');
                    element.addClass('spinner-hide');
                    angular.element(element.parent().parent().children()[2]).remove();
                });
                scope.$watch('ngSrc',function(){
                    element.addClass('spinner-hide');
                })
            }
        }
    }
})();