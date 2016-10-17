(function(){
    'use strict';

    angular.module('myapp').factory('toast',Toast);

    Toast.$inject = ['$mdToast','$document'];

    function Toast($mdToast,$document){
        return {
            triggerToast: triggerToast
        };

        function triggerToast(position,msg,ctrl, toastClass, toastWrapper, hideDelay){


            var positionStr = position ? Object.keys(position).filter(function(pos){ // TODO a bit redundant
                return position[pos]
            }).join(' '):'';

            $mdToast.show(
                {
                    controller: ctrl,
                    template: '<md-toast class="'+toastClass+'"><span style="margin: 10px 15px 10px 15px">'+msg+'</span></md-toast>',
                    parent: $document[0].querySelector(toastWrapper),
                    hideDelay:hideDelay,
                    position: positionStr
                }
            )
        }

    }
})();