(function(){
    'use strict';

    angular.module('myapp').directive('usersPagination', UsersPagination);

    UsersPagination.$inject = ['$location','$anchorScroll', 'usersResource'];

    function UsersPagination($location, $anchorScroll,usersResource){
        return {
            restrict: 'E',
            replace:'true',
            templateUrl: 'directives/usersPagination.html',
            link: function(scope,element,attrs,ctrl) {
                /** no game term pagination **/
                scope.pageUp = pageUp;

                scope.pageDown = pageDown;

                function pageUp(e){
                    $location.hash('top');                                               // sets the mark or hash on the ID 'top'
                    $anchorScroll();                                              // scroll to this mark.
                    if (scope.pageUpCheck){
                        return
                    }

                    usersResource.getNextBatch({},function(data){
                            ctrl.users = data;
                            ctrl.users.forEach(function(ea,i){
                                if (ea.personal) {
                                    ctrl.users[i].age = Math.floor((new Date() - new Date(ea.personal.birthdate)) / (1000 * 60 * 60 * 24 * 365));
                                }
                            });
                            scope.pageDownCheck = data[0].firstUserPageID == data[0].userPageID; // keep checking as we go up and down pages if buttons need to be disabled
                            scope.pageUpCheck = data[0].veryLastUserPageID == data[data.length-1].userPageID; // check if its last page and disable up button.
                            
                        },
                        function(){
                            console.log('shit not found');
                        });
                }

                function pageDown(e){
                    $location.hash('top');                                               // sets the mark or hash on the ID 'top'
                    $anchorScroll();                                              // scroll to this mark.
                    if (scope.pageDownCheck){
                        return
                    }

                    usersResource.getPreviousBatch({},function(data){
                            ctrl.users = data;
                            ctrl.users.forEach(function(ea,i){
                                if (ea.personal) {
                                    ctrl.users[i].age = Math.floor((new Date() - new Date(ea.personal.birthdate)) / (1000 * 60 * 60 * 24 * 365));
                                }
                            });

                            scope.pageDownCheck = data[0].firstUserPageID == data[0].userPageID; // on the first document is sent along the very first userID and the current batch's first user ID. compare and adjust the "previous" btn to disable or not.
                            scope.pageUpCheck = data[0].veryLastUserPageID == data[data.length-1].userPageID;

                        },
                        function(){
                            console.log('shit not found');
                        });
                }
            },
            require: '^usersCtrlDelegate'
        }
    }
})();