(function(){
    'use strict';

    angular.module('myapp').controller('settingsController',SettingsController);

    SettingsController.$inject = ['selectmethods','selectoptions', 'userResource','settingsService','$scope','toast'];

    function SettingsController(selectmethods, selectoptions, userResource,settingsService, $scope, toast){
        var settingsCtrl = this,
            month,
            day,
            year;

        settingsCtrl.setting = {
            personal:true,
            profile:false,
            preferences:false
        };

        settingsCtrl.genders = selectmethods.mapToObj(selectoptions.genders);
        settingsCtrl.querySearch = selectmethods.createQueryResults;
        settingsCtrl.countries = selectmethods.mapToObj(selectoptions.countries);
        settingsCtrl.languages = selectmethods.mapToObj(selectoptions.languages);
        settingsCtrl.regions = selectmethods.mapToObj(selectoptions.regions);
        settingsCtrl.intents = selectmethods.mapToObj(selectoptions.intents);
        settingsCtrl.communications = selectmethods.mapToObj(selectoptions.communications);
        /*** new ***/
        settingsCtrl.serverregions = selectmethods.mapToObj(selectoptions.serverregions);
        settingsCtrl.dotamodes = selectmethods.mapToObj(selectoptions.dotamodes);
        settingsCtrl.solommrs = selectmethods.mapToObj(selectoptions.solommrs);
        settingsCtrl.partymmrs = selectmethods.mapToObj(selectoptions.partymmrs);
        settingsCtrl.dotaroles = selectmethods.mapToObj(selectoptions.dotaroles);

        settingsCtrl.csgomodes = selectmethods.mapToObj(selectoptions.csgomodes);
        settingsCtrl.csgoranks = selectmethods.mapToObj(selectoptions.csgoranks);
        settingsCtrl.csgoroles = selectmethods.mapToObj(selectoptions.csgoroles);
        settingsCtrl.teams = selectmethods.mapToObj(selectoptions.teams);
        settingsCtrl.howlongs = selectmethods.mapToObj(selectoptions.howlongs);

        userResource.getUser('thisuser',function(data){
            data.general = data.general || {};
            data.personal = data.personal || {};
            settingsCtrl.user = data;

            settingsCtrl.hasDota = gameCheck(data,570);
            settingsCtrl.hasCSGO = gameCheck(data,730);

            var displayRegion = capitalize(data.general.region);

            settingsCtrl.selectedGender = {
                display: capitalize(data.personal.gender), value:data.personal.gender
            };

            month = data.personal.birthdate ?new Date(data.personal.birthdate).getMonth()+1 : undefined;

            if (month){
                if ((""+month).length == 1){
                    month = "0"+month;
                }
            }

            day= data.personal.birthdate ? new Date(data.personal.birthdate).getDate(): undefined;

            if (day){

                if ((""+day).length == 1){
                    day = "0".concat(day);
                }
            }

            var rawyear = data.personal.birthdate ?  new Date(data.personal.birthdate).getFullYear():  new Date(data.personal.birthdate).getFullYear();

            settingsCtrl.selectedBirthdate = month ? month+"/"+day+"/"+rawyear : "";

            settingsCtrl.selectedRegion = data.general.region ? {
                display: displayRegion, value: data.general.region.toLowerCase()
            } : '';
            settingsCtrl.selectedItemCountry = data.personal.country ? {display: capitalize(data.personal.country), value:data.personal.country} : '';
            settingsCtrl.selectedItemLanguage = data.personal.language ? {display: capitalize(data.personal.language),value: data.personal.language}: '';
            settingsCtrl.selectedTime = data.general.time;
            settingsCtrl.selectedIntent = {
                display: data.general.intent, value: data.general.intent
            };

            settingsCtrl.selectedCommunication = {
                display: data.personal.communication, value: data.personal.communication
            };

            settingsCtrl.introduction = data.general.introduction;

            settingsCtrl.serverregion = {display:capitalize(data.dota.serverregion),value:data.dota.serverregion};

            settingsCtrl.dotamode= {display:capitalize(data.dota.mode),value:data.dota.mode};

            settingsCtrl.solommr= {display:capitalize(data.dota.rank.solommr),value:data.dota.rank.solommr};

            settingsCtrl.partymmr= {display:capitalize(data.dota.rank.partymmr),value:data.dota.rank.partymmr};

            settingsCtrl.dotarole= {display:capitalize(data.dota.position),value:data.dota.position};

            settingsCtrl.csgomode = {display:capitalize(data.csgo.mode),value:data.csgo.mode};

            settingsCtrl.csgorank = {display:capitalize(data.csgo.rank),value:data.csgo.rank};

            settingsCtrl.csgorole = {display:capitalize(data.csgo.role),value:data.csgo.role};

            settingsCtrl.team = {display:capitalize(data.csgo.team),value:data.csgo.team};

            settingsCtrl.howlong = {display:capitalize(data.csgo.howlong),value:data.csgo.howlong};

            settingsCtrl.preferences = {
                addSteamSetting: data.settings.user.addSteamSetting,
                msgOnSiteSetting:data.settings.user.msgOnSiteSetting,
                profilePrivacy:data.settings.user.profilePrivacy,
                noDisplayStats: data.settings.user.noDisplayStats,
                noDisplayLinks: data.settings.user.noDisplayLinks
            };
        }/*, true*/);   // need to turn off caching for IE or it will never populate new data.



        /** settings presets from db **/



   /*     $scope.user = data;

        var watcher =$scope.$watch('user',function(nV,oV){               // data's filling up data is async so theres a good chance data is undefined by the time the code below runs. so we adjust accordingly
            refreshScope();
            watcher();
            settingsCtrl.user = $scope.user;

        },true);*/

     /*   function refreshScope(){
            settingsCtrl.hasDota = gameCheck(data,570);
            settingsCtrl.hasCSGO = gameCheck(data,730);

            var displayRegion = capitalize(data.general.region);

            settingsCtrl.selectedGender = {
                display: capitalize(data.personal.gender), value:data.personal.gender
            };

            month = data.personal.birthdate ?new Date(data.personal.birthdate).getMonth()+1 : undefined;

            if (month){
                if ((""+month).length == 1){
                    month = "0"+month;
                }
            }

           day= data.personal.birthdate ? new Date(data.personal.birthdate).getDate(): undefined;

            if (day){

                if ((""+day).length == 1){
                    day = "0".concat(day);
                }
            }

            var rawyear = data.personal.birthdate ?  new Date(data.personal.birthdate).getFullYear():  new Date(data.personal.birthdate).getFullYear();

            settingsCtrl.selectedBirthdate = month ? month+"/"+day+"/"+rawyear : "";

            settingsCtrl.selectedRegion = {
                display: displayRegion, value: data.general.region
            };
            settingsCtrl.selectedItemCountry = {display: capitalize(data.personal.country), value:data.personal.country};
            settingsCtrl.selectedItemLanguage = {display: capitalize(data.personal.language),value: data.personal.language};
            settingsCtrl.selectedTime = data.general.time;
            settingsCtrl.selectedIntent = {
                display: data.general.intent, value: data.general.intent
            };

            settingsCtrl.selectedCommunication = {
                display: data.personal.communication, value: data.personal.communication
            };

            settingsCtrl.introduction = data.general.introduction;

            settingsCtrl.serverregion = {display:capitalize(data.dota.serverregion),value:data.dota.serverregion};

            settingsCtrl.dotamode= {display:capitalize(data.dota.mode),value:data.dota.mode};

            settingsCtrl.solommr= {display:capitalize(data.dota.rank.solommr),value:data.dota.rank.solommr};

            settingsCtrl.partymmr= {display:capitalize(data.dota.rank.partymmr),value:data.dota.rank.partymmr};

            settingsCtrl.dotarole= {display:capitalize(data.dota.position),value:data.dota.position};

            settingsCtrl.csgomode = {display:capitalize(data.csgo.mode),value:data.csgo.mode};

            settingsCtrl.csgorank = {display:capitalize(data.csgo.rank),value:data.csgo.rank};

            settingsCtrl.csgorole = {display:capitalize(data.csgo.role),value:data.csgo.role};

            settingsCtrl.team = {display:capitalize(data.csgo.team),value:data.csgo.team};

            settingsCtrl.howlong = {display:capitalize(data.csgo.howlong),value:data.csgo.howlong};

            settingsCtrl.preferences = {
                addSteamSetting: data.settings.user.addSteamSetting,
                msgOnSiteSetting:data.settings.user.msgOnSiteSetting,
                profilePrivacy:data.settings.user.profilePrivacy,
                noDisplayStats: data.settings.user.noDisplayStats,
                noDisplayLinks: data.settings.user.noDisplayLinks
            };
        }
*/


        /** presets end **/

        settingsCtrl.triggerTab = triggerTab;

        settingsCtrl.bindToModel = bindToModel;

        settingsCtrl.save = save;

        function capitalize(str){
            if (!str){
                return '';
            }
            var strSplit = str.split(" ");
            strSplit.forEach(function(ea,i){
                strSplit[i] = ea.charAt(0).toUpperCase()+ea.slice(1);
            });

            return strSplit.join(" ");
        }

        function triggerTab(tabname){
            angular.forEach(settingsCtrl.setting, function(value,key){
                if (key != tabname){
                    settingsCtrl.setting[key] = false;
                } else {
                    settingsCtrl.setting[key] = true;
                }
            })
        }

        function bindToModel(propName,selection){

            if (selection == 'all' || selection == 'All'){
                return settingsCtrl[propName] = '';
            }

            settingsCtrl[propName] = selection;
        }

     /*   settingsCtrl.csgomode = {display:capitalize(data.csgo.mode),value:data.csgo.mode};

        settingsCtrl.csgorank = {display:capitalize(data.csgo.rank),value:data.csgo.rank};

        settingsCtrl.csgorole = {display:capitalize(data.csgo.role),value:data.csgo.role};

        settingsCtrl.team = {display:capitalize(data.csgo.team),value:data.csgo.team};

        settingsCtrl.howlong = {display:capitalize(data.csgo.howlong),value:data.csgo.howlong};*/


        function save(){
            var dateparts,dateobj;
            if (settingsCtrl.selectedBirthdate){
                dateparts = settingsCtrl.selectedBirthdate.split("/");
                dateobj = new Date(dateparts[2],dateparts[0]-1,dateparts[1]);

                var validDateDifference = ((new Date() - dateobj)/(1000*60*60*24*365)) <= 100;

                var reg = new RegExp('\\d{1,2}/\\d{1,2}/\\d{4}');

                var checker = settingsCtrl.selectedBirthdate.match(reg);

                if (!checker || !validDateDifference || !(dateparts[2] <= new Date().getFullYear()) || !(dateparts[1] <= 31) || !(parseInt(dateparts[0]) <= 12)){
                    var msgTwo = 'Please enter the date in valid format.';
                    return toast.triggerToast({},msgTwo,'','warning-toast','.settings-toast',3000);
                }
            }

            var postData = {
                personal:{
                    language: settingsCtrl.selectedItemLanguage.value,
                    country: settingsCtrl.selectedItemCountry.value,
                    communication: settingsCtrl.selectedCommunication.value,
                    gender: settingsCtrl.selectedGender.value,
                    birthdate: dateobj
                },
                dota:{
                    serverregion: settingsCtrl.serverregion.value,
                    position: settingsCtrl.dotarole.value,
                    rank: {
                        solommr : settingsCtrl.solommr.value,
                        partymmr : settingsCtrl.partymmr.value
                    },
                    mode: settingsCtrl.dotamode.value
                },
                csgo:{
                    mode: settingsCtrl.csgomode.value,
                    rank: settingsCtrl.csgorank.value,
                    role: settingsCtrl.csgorole.value,
                    team : settingsCtrl.team.value,
                    howlong: settingsCtrl.howlong.value
                },
                general:{
                    region: settingsCtrl.selectedRegion.display,
                    time: settingsCtrl.selectedTime,
                    intent: settingsCtrl.selectedIntent.value,
                    introduction:settingsCtrl.introduction
                },
                settings:{
                    user:{
                        addSteamSetting: settingsCtrl.preferences.addSteamSetting || false,
                        msgOnSiteSetting: settingsCtrl.preferences.msgOnSiteSetting || false,
                        profilePrivacy: settingsCtrl.preferences.profilePrivacy || false,
                        noDisplayStats: settingsCtrl.preferences.noDisplayStats || false,
                        noDisplayLinks: settingsCtrl.preferences.noDisplayLinks || false
                    }
                }
            };
            console.log(postData);
            settingsService.updateSettings(postData);
        }

        function gameCheck(User, appid) {                                                                                                      // check for existance of game in either ownedgames or recentlyplayed
            var recentlyPlayed = [];
            if (User.hasOwnProperty('settings')) {
                recentlyPlayed = User.recentlyPlayed;
            }
            return recentlyPlayed.some(function (ea, i) {
                    return (ea.appid == appid);
                });
        }
    }
})();