(function() {

    'use strict';

    angular.module('myapp').controller('usersController', UsersController);

    UsersController.$inject = ['usersResource', 'userResource','$cacheFactory','userStore','$stateParams', 'selectmethods','selectoptions', '$scope', 'toast','$location','$anchorScroll'];

    function UsersController(usersResource, userResource, $cacheFactory, userStore,$stateParams,selectmethods,selectoptions,$scope, toast, $location, $anchorScroll) {
        /*** note: controllers are called every time state changes ***/

        var usersCtrl = this;

       /* var meta = angular.element(document.querySelector('.metadescrip'));

        meta.attr('content','Filter a list of Steam users by criteria such as age, region, country, gender, and dedication. Then find the right Steam friend to add.');

        var title =  angular.element(document.querySelector('#main-title'));

        title.html("Steam Friends - Users Directory");

        $scope.$emit('newPageLoaded','Select a Steam game from a list, or search for it. Clicking on a game shows the users that play the game.');*/

        $scope.$emit('newPageLoaded',{description:'Filter a list of Steam users by criteria such as age, region, country, gender, and dedication. Then find the right Steam friend to add.',title:'Steam User Directory'});

        usersCtrl.section = $stateParams.game ? $stateParams.game : "All Games";
        usersCtrl.querySearch = selectmethods.createQueryResults;

        usersCtrl.selectedItemCountry = {display: "All", value: "all"};
        usersCtrl.selectedItemLanguage = {display: "English", value: "english"};

        usersCtrl.countries = selectmethods.mapToObj(selectoptions.countries,true);
        usersCtrl.regions = selectmethods.mapToObj(selectoptions.regions,true);
        usersCtrl.intents = selectmethods.mapToObj(selectoptions.intents,true);

        usersCtrl.languages = selectmethods.mapToObj(selectoptions.languages,true);
        usersCtrl.servers = selectmethods.mapToObj(selectoptions.serverregions,true);
        usersCtrl.ages = selectmethods.mapToObj(selectoptions.ages,true);

        /** dota select options **/

        usersCtrl.dotamodes = selectmethods.mapToObj(selectoptions.dotamodes,true);
        usersCtrl.solommrs = selectmethods.mapToObj(selectoptions.solommrs,true);
        usersCtrl.partymmrs = selectmethods.mapToObj(selectoptions.partymmrs,true);
        usersCtrl.dotaroles = selectmethods.mapToObj(selectoptions.dotaroles,true);

        /** dota options end **/

        /** csgo select options **/

        usersCtrl.csgomodes = selectmethods.mapToObj(selectoptions.csgomodes,true);
        usersCtrl.csgoranks = selectmethods.mapToObj(selectoptions.csgoranks,true);
        usersCtrl.csgoroles = selectmethods.mapToObj(selectoptions.csgoroles,true);
        usersCtrl.howlongs = selectmethods.mapToObj(selectoptions.howlongs,true);


        usersCtrl.communications = selectmethods.mapToObj(selectoptions.communications,true);


        usersResource.getUsers($stateParams.game, function(data){
            if (data[0].searchFormHistory){
                var presets = data[0].searchFormHistory,
                   personal = presets.personal || {},


                    country = personal.country || 'all',
                    language = personal.language || 'all',
                    gender = personal.gender || '',
                    comm = personal.communication || 'all';

                var general = presets.general || {},

                    aim = general.intent || 'all',
                    region = general.region instanceof Object ? 'eu (all)':(general.region || 'all');

                var dota = presets.dota || {},

                    server = dota.serverregion || 'all',
                    intent = dota.mode || 'all',
                    position = dota.position || 'all',
                    rank = dota.rank || {},
                    solommr = rank.solommr || 'all',
                    partymmr = rank.partymmr || 'all';

                var csgo = presets.csgo || {},

                    csgomatchmaking = csgo.mode || 'all',
                    csgorank = csgo.rank || 'all',
                    csgorole = csgo.role || 'all',
                    howlong = csgo.howlong || 'all';

                usersCtrl.selectedItemLanguage = {display: capitalize(language) || 'All',value: language || 'all'};
                usersCtrl.gender = gender;
                usersCtrl.selectedItemCountry = {display: capitalize(country) || 'All', value:country || 'all'};
                usersCtrl.comm = comm;
                usersCtrl.aim = aim;
                usersCtrl.region = region;
                usersCtrl.csgomatchmaking = csgomatchmaking;
                usersCtrl.csgorank = csgorank;
                usersCtrl.csgorole = csgorole;
                usersCtrl.howlong = howlong;
                usersCtrl.server = server;
                usersCtrl.intent = intent;
                usersCtrl.position = position;
                usersCtrl.solommr = solommr;
                usersCtrl.partymmr = partymmr;
            }

            cacheReplace($cacheFactory.get('myCache'),'lastGameFormSearched',$stateParams.game);

            usersCtrl.users = data;
            /*usersCtrl.users = cacheAndReturnArr($cacheFactory.get('myCache'),data,$stateParams.game);*/

            usersCtrl.users.forEach(function(ea,i){
                if (ea.personal) {
                    usersCtrl.users[i].age = Math.floor((new Date() - new Date(ea.personal.birthdate)) / (1000 * 60 * 60 * 24 * 365));
                }
            });

            /** users page with search term **/
            $scope.pageDownCheck = data[0].firstUserPageID == data[0].userPageID;   // inital disabling of the button because we are always on first page here
            $scope.pageUpCheck = data[data.length-1].userPageID == data[0].veryLastUserPageID;

            if ($stateParams.game == 'Dota 2'){
                return usersCtrl.showDotaForms = true;
            }

            if ($stateParams.game == 'Counter-Strike: Global Offensive'){
                return usersCtrl.showCsgoForms = true;
            }

            usersCtrl.showDotaForms = false;
            usersCtrl.showCsgoForms = false;
        },function(err){
            console.log(err);
            usersCtrl.users = [];
            /*    usersCtrl.users = cacheAndReturnArr($cacheFactory.get('myCache'),[],$stateParams.game);*/
            $scope.pageDownCheck = true;
            $scope.pageUpCheck = true;
        });



        userResource.getUser('refreshuser',function(thisuser){
            userStore.user.general = thisuser.general;
            userStore.user.personal = thisuser.personal;

            userStore.user.notifications = thisuser.notifications;
            userStore.user.conversations = thisuser.conversations;
            userStore.user.settings = thisuser.settings;
            userStore.user.social = thisuser.social;
            userStore.user.blocked = thisuser.blocked;
            userStore.user.comments = thisuser.comments;
        });

        /** users ng-repeat filter model binding for country,language,age, dota2 serverregion, dota2 typeofplay,communication **/

        usersCtrl.bindToModel = bindToModel;

        usersCtrl.sendFormData = sendFormData;

        usersCtrl.resetFields = resetFields;

        function sendFormData(e){
            e.preventDefault();
            var formdata={
                personal:{
                    language: usersCtrl.selectedItemLanguage.value,
                    agerange: usersCtrl.age,
                    gender: usersCtrl.gender,
                    country: usersCtrl.selectedItemCountry.value,
                    communication: usersCtrl.comm
                },
                general:{
                    intent: usersCtrl.aim,
                    region: usersCtrl.region
                }
            };

            if (usersCtrl.showCsgoForms){

                formdata.csgo= {
                    mode: usersCtrl.csgomatchmaking,
                    rank: usersCtrl.csgorank,
                    role: usersCtrl.csgorole,
                    howlong: usersCtrl.howlong
                }
            }

            if (usersCtrl.showDotaForms){
                formdata.dota={
                    serverregion: usersCtrl.server,
                    mode: usersCtrl.intent,
                    position: usersCtrl.position,
                    rank:{
                        solommr: usersCtrl.solommr,
                        partymmr: usersCtrl.partymmr
                    }
                }
            }

            /** cleaning up form data of empty fields or unnecessary ones **/

            Object.keys(formdata).forEach(function(ea){
                if (typeof formdata[ea] == 'object') {
                    Object.keys(formdata[ea]).forEach(function (each) {
                        if (typeof formdata[ea][each] == 'object'){
                            Object.keys(formdata[ea][each]).forEach(function(item){
                                if (formdata[ea][each][item] == '' || formdata[ea][each][item] == 'all') {
                                    delete formdata[ea][each][item];
                                }
                            });

                            if (Object.keys(formdata[ea][each]).length === 0) {
                                delete formdata[ea][each];
                            }
                        } else {
                            if (formdata[ea][each] == '' || formdata[ea][each] == 'all') {
                                delete formdata[ea][each];
                            }
                        }
                    });

                    if (Object.keys(formdata[ea]).length === 0) {
                        delete formdata[ea];
                    }
                } else {
                    if (formdata[ea] == '' || formdata[ea] == 'all'){
                        delete formdata[ea];
                    }
                }
            });

            if (formdata.personal){                                                                     // make an age range acceptable by mongoose
                if (formdata.personal.agerange){
                    var splitRegex = /-|\+/;
                    var endPoints = formdata.personal.agerange.split(splitRegex);

                    if (!endPoints[1]){
                        formdata.personal.agerange = [new Date(new Date()-new Date(endPoints[0]*(1000*60*60*24*365)))];       // greater than 35 years old
                    }



                    if (endPoints[1]){
                        formdata.personal.agerange = endPoints.map(function(ea,i){
                            if (i == 1){
                                return new Date(new Date()-new Date((+ea+1)*(1000*60*60*24*365)));
                            }

                            return new Date(new Date()-new Date(ea*(1000*60*60*24*365)));
                        });
                    }
                }
            }

            /** end cleanup **/
            var msg = 'All';
            if ($stateParams.game){
                formdata.gameterm = $stateParams.game;
                msg = $stateParams.game;
            }

            cacheReplace($cacheFactory.get('myCache'),'lastGameFormSearched',$stateParams.game);

            usersResource.sendSearchForm(formdata, function(data){
                    /*     usersCtrl.users = cacheAndReturnArr($cacheFactory.get('myCache'),data,$stateParams.game);*/

                    usersCtrl.users = data;
                    usersCtrl.users.forEach(function(ea,i){
                        if (ea.personal){
                            usersCtrl.users[i].age = Math.floor((new Date()-new Date(ea.personal.birthdate))/(1000*60*60*24*365));
                        }
                    });
                    $scope.pageDownCheck = data[0].userPageID == data[0].firstUserPageID;
                    $scope.pageUpCheck = data[data.length-1].userPageID == data[0].veryLastUserPageID;
                    toast.triggerToast({},'Displaying results for: '+msg,'','success-toast','.users-toast', 3000);

                },
                function(){
                    usersCtrl.users = [];
                    /*              usersCtrl.users = cacheAndReturnArr($cacheFactory.get('myCache'),[],$stateParams.game);*/
                    $scope.pageDownCheck = true;
                    $scope.pageUpCheck = true;

                }
            );
        }

        function resetFields($event){
            usersCtrl.selectedItemLanguage = {display: 'All',value: 'all'};
            usersCtrl.gender = '';
            usersCtrl.selectedItemCountry = {display:'All', value:'all'};
            usersCtrl.comm = 'all';
            usersCtrl.aim = 'all';
            usersCtrl.region = 'all';
            usersCtrl.csgomatchmaking = 'all';
            usersCtrl.csgorank = 'all';
            usersCtrl.csgorole = 'all';
            usersCtrl.age = 'all';
            usersCtrl.howlong = 'all';
            usersCtrl.server = 'all';
            usersCtrl.intent = 'all';
            usersCtrl.position = 'all';
            usersCtrl.solommr = 'all';
            usersCtrl.partymmr = 'all';
        }

        function bindToModel(propName,selection){

            if (selection == 'all' || selection == 'All'){
                return usersCtrl[propName] = '';
            }

            usersCtrl[propName] = selection;
        }

        function capitalize(str){
            var strSplit = str.split(" ");
            strSplit.forEach(function(ea,i){
                strSplit[i] = ea.charAt(0).toUpperCase()+ea.slice(1);
            });

            return strSplit.join(" ");
        }
    }

    function cacheReplace(mycache, key, game){

        var historycache = mycache.get(key);
        if (historycache){
            mycache.remove(key);
        }
        mycache.put(key,game);
    }



})();


