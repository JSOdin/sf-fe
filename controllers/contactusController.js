(function(){
    'use strict';

    angular.module('myapp').controller('contactusController',ContactusController);

    ContactusController.$inject = ['userResource','Dialog','$mdDialog','userStore','toast','$scope'];

    function ContactusController(userResource, Dialog, $mdDialog, userStore,toast,$scope){
            var cntCtrl = this;


        var meta = angular.element(document.querySelector('.metadescrip'));

        meta.attr('content','Ask us anything about Steamfriends.net. Also report any bugs or suggest improvements to the site.');


        var title =  angular.element(document.querySelector('#main-title'));

        title.html("Contact Us");

        cntCtrl.sendMsg = function(subject, body){
            var msg = {
                subject:subject,
                body:body
            };

            userResource.contactUs(msg, function(){
                toast.triggerToast({}, 'Message sent. Thanks for the feedback!','contactusController','success-toast','.convo-toast',3000);
            },function(){

            })
        }
    }
})();