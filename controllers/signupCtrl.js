(function() {

    'use strict';

    angular.module('myapp').controller('signupController', SignupController);

    SignupController.$inject = ['$state', 'userStore', '$http', 'selectoptions', 'selectmethods','usersResource','Dialog','userResource', '$mdDialog'];

    function SignupController($state, userStore, $http, selectoptions,selectmethods, usersResource, Dialog,userResource, $mdDialog) {

        var signupCtrl = this;

        // triggers that decide div sizes in signup screen //

        signupCtrl.csgo = function () {
            return gameCheck(userStore.user,730) && !userStore.user.settings.admin.appcheck.csgo;                  // if csgo is owned by user and csgo settings are not set
        };

        signupCtrl.dota = function () {
            return gameCheck(userStore.user,570) && !userStore.user.settings.admin.appcheck.dota;                          // if dota is owned by user and dota settings are not set
        };

        signupCtrl.dotaSize = signupCtrl.dota() && !signupCtrl.csgo();
        signupCtrl.csgoSize = !signupCtrl.dota() && signupCtrl.csgo();

        /** filling in select options **/

        var initialValues = ["US West","League", "Ranked Matchmaking", "Master Guardian Elite","4000-4500", "Entry Fragger", "4000-4500", "No","#1 - hard carry","1-3 years"];
        var initialKeys = ["serverregion","csgomode","dotamode","csgorank","solommr","csgorole","partymmr","team","dotarole","howlong"];

        angular.forEach(initialKeys, function(ea,i){
            signupCtrl[ea+"s"] = selectmethods.mapToObj(selectoptions[ea+"s"]);
        });

        /** initial values **/

        angular.forEach(initialValues,function(ea,i){
            var key = initialKeys[i];
            signupCtrl[key] = ea.toLowerCase();
        });



        /** methods **/

        signupCtrl.submitGameProfile = submitGameProfile;

        signupCtrl.skipGameForm = skipGameForm;

        function skipGameForm(){
            return $state.go('games');
        }

        function submitGameProfile(){
            var data = {};
            if (signupCtrl.dotaSize){
                data = {
                    dota:{
                        mode: signupCtrl.dotamode,
                        rank: {
                            partymmr: signupCtrl.partymmr,
                            solommr: signupCtrl.solommr
                        },
                        position: signupCtrl.dotarole,
                        serverregion: signupCtrl.serverregion
                    }
                }
            } else if (signupCtrl.csgoSize){
                data = {
                    csgo:{
                        mode: signupCtrl.csgomode,
                        rank: signupCtrl.csgorank,
                        role: signupCtrl.csgorole,
                        team: signupCtrl.csgoteam,
                        howlong: signupCtrl.howlong
                    }
                }
            } else {
                data ={
                    csgo:{
                        mode: signupCtrl.csgomode,
                        rank: signupCtrl.csgorank,
                        role: signupCtrl.csgorole,
                        team: signupCtrl.team,
                        howlong: signupCtrl.howlong
                    },
                    dota:{
                        mode: signupCtrl.dotamode,
                        rank: {
                            partymmr: signupCtrl.partymmr,
                            solommr: signupCtrl.solommr
                        },
                        position: signupCtrl.dotarole,
                        serverregion: signupCtrl.serverregion
                    }
                }
            }

            usersResource.submitGameProfile(data, function(){
                userStore.user.settings.admin.submittedgameprofile = true;
                console.log('submitted profile info succesfully');
                $state.go('games');
            })
        }

        function gameCheck(User, appid) {                                                                                                      // check for existance of game in either ownedgames or recentlyplayed
            var ownedgames = [],
                recentlyPlayed = [];
            if (User) {
                ownedgames = User.ownedGames;
                recentlyPlayed = User.recentlyPlayed;
            }
            return ownedgames.some(function (ea, i) {
                    return (ea.appid == appid);
                }) || recentlyPlayed.some(function (ea, i) {
                    return (ea.appid == appid);
                });
        }
    }
})();
