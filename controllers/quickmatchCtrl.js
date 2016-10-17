(function(){
    'use strict';

    angular.module('myapp').controller('quickmatchController',QuickmatchController);

    QuickmatchController.$inject = ['userResource','userStore','$stateParams','$location','$mdDialog','$scope','$state','$rootScope','Dialog','$timeout','gameResource','selectmethods','$q','usersResource','$anchorScroll','$window','toast'];

    function QuickmatchController(userResource, userStore, $stateParams,$location, $mdDialog,$scope, $state, $rootScope, Dialog,$timeout, gameResource,selectmethods ,$q,usersResource, $anchorScroll, $window,toast){
         var QMCtrl = this;


         $scope.searchTextGame = QMCtrl.searchTextGame;
         QMCtrl.avatarUrl = userStore.user.avatarfull;

         QMCtrl.querySearch = querySearch;

        QMCtrl.quickMatch = quickMatch;

        QMCtrl.goToProfile = goToProfile;

        QMCtrl.addOnSteam= addOnSteam;

        function querySearch(searchText){

            var defer = $q.defer();
            gameResource.getGames(searchText,function(data){
                return defer.resolve(data);
            },function(){
                return defer.resolve('');
            });
            return defer.promise;
        }
        function quickMatch(game, recentlyplayed){
            if (recentlyplayed){
                game = 'recentlyplayed';
            }
            usersResource.quickFetch(game,function(data){
                $location.hash('quickusers');
                data.players = data.players.filter(function(ea){
                   return !ea.settings.user.addSteamSetting && ea.personastate == 1;
                });
                data.players.forEach(function(ea,i){
                    data.players[i].age = Math.floor((new Date()-new Date(ea.personal.birthdate))/(1000*60*60*24*365));
                });
                console.log(data.players);
                QMCtrl.users = data.players;
                $anchorScroll();
            },function(){
                $location.hash('quickusers');

                QMCtrl.users = [];
                $anchorScroll();
            });
        }

        function goToProfile(id, $event) {

            var targetUrl = $location.absUrl().split('quickmatch')[0]
            $window.open(targetUrl+'find-steam-friend/'+id);
        }

        function addOnSteam(url, $event) {
            toast.triggerToast({}, 'Added successfully. Check your Steam client.', 'usersController as usersCtrl', 'success-toast', '.users-toast', 3000);

            return $window.location.href = url;
        }
    }
})();

