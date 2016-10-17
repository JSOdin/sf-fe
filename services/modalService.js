(function(){
    'use strict';

    angular.module('myapp').factory('modal',Modal);

    Modal.$inject = ['$mdDialog'];

    function Modal($mdDialog){
        function triggerModal(ctrl,templateUrl,event){
            $mdDialog.show({
                controller:ctrl,
                templateUrl: templateUrl,
                parent:angular.element(document.body),
                targetEvent:event,
                clickOutsideToClose:true
            });
        }

        return {
            triggerModal:triggerModal
        };
    }
})();