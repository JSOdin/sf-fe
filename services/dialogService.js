(function(){
    'use strict';

    angular.module('myapp').factory('Dialog',Dialog);

    Dialog.$inject = ['$mdDialog'];

    function Dialog($mdDialog){

        return {
            openModal:openModal,
            hide: hide,
            cancel: cancel
        };

        function openModal(event,controller,templateUrl,removeFn){
            this.mdDialog = $mdDialog;
            this.show = function(){
                return this.mdDialog.show({
                    controller: controller,
                    templateUrl: templateUrl,
                    parent:angular.element(document.body),
                    targetEvent:event,
                    clickOutsideToClose:true,
                    onRemoving: this.onRemove
                })
            };
            this.onRemove = removeFn ? removeFn : null;
        }

        function hide(cb){
            this.openModal.hide();
            cb();
        }

        function cancel(){
            this.openModal.cancel();
        }

    }
})();