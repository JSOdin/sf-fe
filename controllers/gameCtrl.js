(function() {

    'use strict';

    angular.module('myapp').controller('gamesController', GamesController);

    GamesController.$inject = ['$scope', '$http', 'gameResource','$interval', 'userResource', 'userStore','$state','$rootScope','Dialog'];

    function GamesController($scope, $http, gameResource,$interval,userResource, userStore,$state,$rootScope,Dialog) {
        var gamesCtrl = this;

        $scope.$emit('newPageLoaded',{description:'Select a Steam game from a list, or search for it. Clicking on a game shows the users that play the game.',title:'Steam Games Directory'});

        /*var meta = angular.element(document.querySelector('.metadescrip'));

        meta.attr('content','Select a Steam game from a list, or search for it. Clicking on a game shows the users that play the game.');*/


/*        var title =  angular.element(document.querySelector('#main-title'));

        title.html("Steam Friends - Games Directory");*/

       /* stateTransfer();*/

        gamesCtrl.apps = [];

        $scope.argsarr=[];

        var unreg = $scope.$watch(watchSearchExpression, searchListenerFn);   // you can un-watch by calling the returned function by $watch

        gamesCtrl.suggestGame = suggestGame;

        getGames();

        /** methods **/

        function stateTransfer(){
            if (userStore.user.hasOwnProperty('settings')) {                                                                        // if a user tries to force his way to the /games url without completing forms,
                if (!userStore.user.settings.admin.generalpersonal) {                                                               // redirect him to form.
                    $state.go('privatesettings');
                } else if (!userStore.user.settings.admin.submittedgameprofile) {
                    $state.go('profilesetup')
                }
            }
        }

        function watchSearchExpression() {
            return $scope.search;
        }

        function searchListenerFn(newValue, oldValue) {
            if (newValue == oldValue) {                                     // dont call server if search term is the same
                return;
            }

            if (!newValue){                                                // empty strings evaluate to false. if newvalue is empty but previous value was not
                newValue = 'displayall';                                   // therefore, prevent going to the fetchgames route with no params because that brings up the search sessions history
                $scope.searchterm = '';                                 // reset search term in gamesCtrl which switches pagination mode in pagination.js to no-term, "pageup" and "pagedown" route pagination
            }
            gameResource.getGames(newValue, function (data) {
                    $scope.nogames=false;
                    $scope.searchterm = data[0].term;                      // need to let the pagination directive know there was a search term.
                    $scope.argsarr = [0,16];                                  // scope array used for pagination. first value is currentpage-1 and second is pagesize.
                    gamesCtrl.apps = data;

                    $scope.totalPages = Math.ceil(data.length/16);
                    if (!$scope.searchterm){                                    // in the case that search term is empty (wherea previous term was not)
                        $scope.gamePageNum = data[0].gamePageNum;                                // need to check current session pageNum for disabling/enabling buttons
                        $scope.pageDownCheck = $scope.gamePageNum == 1;
                        $scope.pageUpCheck = data[0].lastpage ? data[0].lastpage : null;
                    } else {
                        $scope.pageDownCheck = $scope.argsarr[0]===0;
                        $scope.pageUpCheck = $scope.argsarr[0]+1 == $scope.totalPages;
                    }
                },
                function (err) {

                    gamesCtrl.apps = [];
                    $scope.pageDownCheck = true;
                    $scope.pageUpCheck = true;
                    $scope.nogames=true;

                    console.log(err.data);
                }
            );
        }

        function suggestGame($event){
            var dialog = new Dialog.openModal($event,'messageController as msgCtrl','/partials/suggestgame');
            dialog.show()
        }

        function getGames(){
            gameResource.getGames('', function (data) {                                 // initially, call server with no params
                    $scope.gamePageNum = data[0].gamePageNum;                                // need to check current session pageNum for disabling/enabling buttons
                    $scope.pageDownCheck = $scope.gamePageNum == 1;
                    gamesCtrl.apps = data;
                },
                function (err) {
                    console.log("coulnd't fetch games: "+err);
                }
            );
        }

        $interval(function(){                                               // periodically update user from the server. this is in gameCtrl because /games is the landing page
            userResource.getUser('refreshuser',function(thisuser){
                if (thisuser) {
                    userStore.user.general = thisuser.general;
                    userStore.user.personal = thisuser.personal;

                    userStore.user.notifications = thisuser.notifications;
                    userStore.user.conversations = thisuser.conversations;
                    userStore.user.settings = thisuser.settings;
                    userStore.user.social = thisuser.social;
                    userStore.user.blocked = thisuser.blocked;
                    userStore.user.comments = thisuser.comments;
                    $rootScope.$broadcast('userfetched')
                }
            })
        },60000);
    }
})();