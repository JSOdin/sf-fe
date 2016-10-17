(function(){                                            // client-side pagination is only used for results with search terms.
    'use strict';

    angular.module('myapp').directive('pagination',Pagination);

    Pagination.$inject = ['gameResource','usersResource','$location','$anchorScroll'];

    function Pagination(gameResource,usersResource,$location,$anchorScroll){
        return {
            restrict: 'E',
            replace:true,
            templateUrl: 'directives/pagination.html',
            link: function(scope,element,attrs,ctrl){

                scope.pageDown = pageDown;

                scope.pageUp = pageUp;

                function pageDown(){

                    /**** term-specific pagination (one time rest call and angular pagination ****/

                    if (scope.searchterm){
                        if (scope.argsarr[0]===0){                                            // argsarr is defined in gamesCtrl scope. stop if first page.
                            return;
                        }

                        scope.argsarr[0]--;
                        scope.pageDownCheck = scope.argsarr[0]===0;
                        scope.pageUpCheck = scope.argsarr[0]+1 == scope.totalPages;
                        $location.hash('top');                                               // sets the mark or hash on the ID 'top'
                        return $anchorScroll();                                              // scroll to this mark.
                    }

                    /**** no term pagination ****/

                    if (scope.gamePageNum !==1) {
                        scope.pageDownCheck = --scope.gamePageNum == 1;                          // reset button if needed
                    }

                    gameResource.getGames('pagedown',function(data){
                        ctrl.apps = data;
                        scope.gamePageNum = data[0].gamePageNum;                                   // double check pagenum
                        scope.pageUpCheck = data[0].lastpage ? data[0].lastpage : null;
                        $location.hash('top');
                        $anchorScroll();
                    })
                }

                function pageUp() {

                    /**** term-specific pagination (one time rest call and angular pagination ****/

                    if (scope.searchterm) {
                        scope.argsarr[0]++;
                        scope.pageDownCheck = scope.argsarr[0] === 0;
                        scope.pageUpCheck = scope.argsarr[0] + 1 == scope.totalPages;
                        $location.hash('top');                                               // sets the mark or hash on the ID 'top'
                        return $anchorScroll();                                              // scroll to this mark.
                    }

                    /**** no term pagination ****/

                    scope.pageDownCheck = ++scope.gamePageNum == 1;                              // need to reset button or downbutton will always be disabled at some point
                    gameResource.getGames('pageup', function (data) {                         // pagination when no search term
                        ctrl.apps = data;
                        scope.gamePageNum = data[0].gamePageNum;                                  // double check pagenum
                        scope.pageUpCheck = data[0].lastpage ? data[0].lastpage : null;
                        $location.hash('top');
                        $anchorScroll();
                    })
                }
            },
            require: '^gamesCtrlDelegate'          // using the "controller:" syntax gamesController was being called twice. "require" allows sharing of one instance.
            // '^' makes lookup on the pagination directive's parent. without the symbol angular would search for the controller on the pagination element only.
        }
    }
})();