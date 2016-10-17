(function(){
    'use strict';

    angular.module('myapp').controller('managepostController', ManagepostController);

    ManagepostController.$inject = ['selectoptions','selectmethods','$scope','gameResource','userResource','toast','$state','postResource'];

    function ManagepostController(selectoptions, selectmethods,$scope,gameResource, userResource,toast,$state,postResource){
        var self = this,
            month,day;

        self.readonly = false;
        self.searchTextGame = null;
        self.searchTextRegion=null;
        self.querySearch = selectmethods.createQueryResults;

        self.allowReddit=false;

        /** get the form options **/
        self.regions = loadRegions();
        self.selectedGameFields = {};

        self.games = [];
        self.languages = loadLanguages();
        self.communications = loadCommunications();
        self.countries = loadCountries();
        self.genres = loadGenres();

        /** pre-select fields on load **/

        self.selectedGames = [];   /* need default value or it throw an error */
        self.selectedCommunications = [];

        /** other settings and functions **/

        self.numberChips = [];
        self.numberChips2 = [];
        self.numberBuffer = '';
        self.autocompleteDemoRequireMatch =true;
        self.transformChip = transformChip;
        self.minimizeState = false;
        self.toggleMinimize = toggleMinimize;
        self.toggleAdditional = toggleAdditional;
        self.chipCount= {};
        self.addCount = addCount;
        self.deleteCount = deleteCount;
        self.memberEditAndBump = memberEditAndBump;
        self.testing = function testing(){
          console.log( self.selectedGames );
        };


        /** form for guests - entry **/

        self.checkPasscodeBump = checkPasscodeBump;

        /** getting form options **/

        userResource.getUser('refreshuser',function(data){      //** for logged in users only **/

            if (!data.personal || !data.general){
                return;
            }


            self.steamid = data.steamid;

            self.selectedItemLanguage = data.personal.language ? {display: capitalize(data.personal.language), value: data.personal.language } :'';
            self.selectedItemRegion = data.general.region ? {display: capitalize(data.general.region), value: data.general.region} : '';
            self.selectedItemCountry = data.personal.country ?  {display: capitalize(data.personal.country), value: data.personal.country} : '';
            self.author = data.personaname;

            console.log('user gender is'+data.personal.gender);
            self.gender = data.personal.gender;
            self.loggedin = data.hasOwnProperty('settings');

           /* month = data.personal.birthdate ? new Date(data.personal.birthdate).getMonth() + 1 : undefined;

            if (month) {
                if (("" + month).length == 1) {
                    month = "0" + month;
                }
            }

            day = data.personal.birthdate ? new Date(data.personal.birthdate).getDate() : undefined;

            if (day) {

                if (("" + day).length == 1) {
                    day = "0".concat(day);
                }
            }

            var rawyear = data.personal.birthdate ? new Date(data.personal.birthdate).getFullYear() : undefined;*/

            self.birthdate = parseDate(data.personal.birthdate);
            self.hasSteamID = self.steamid.length > 0;
            self.hasLanguage = self.selectedItemLanguage.display ? self.selectedItemLanguage.display.length > 0 : false;
            self.hasRegion = self.selectedItemRegion.display ?  self.selectedItemRegion.display.length > 0 : false;
            self.hasCountry = self.selectedItemCountry.display ? self.selectedItemCountry.display.length > 0 : false;
            self.hasBirthdate = self.birthdate ? self.birthdate.length > 0 : false;
            self.hasGender = self.gender ? self.gender.length > 0 : false;

            postResource.manageSinglePost(self.steamid, function(data){         /** fetch existing post **/

                self.options = data.fieldoptions;


                self.birthdate = self.birthdate || (data.birthdate? parseDate(data.birthdate):'');
                self.selectedItemLanguage = self.selectedItemLanguage || (data.language ? {display: capitalize(data.language), value: data.language}:'');
                self.selectedItemRegion = self.selectedItemRegion || (data.region ? {display: capitalize(data.region), value: data.region}:'');
                self.selectedItemCountry = self.selectedItemCountry || (data.country ? {display: capitalize(data.country), value: data.country}:'');
                self.gender = self.gender || data.gender;
                self.selectedCommunications = data.communications ?  data.communications.map(function(ea){
                   return {
                       display: ea,
                       value: ea
                   }
                }) : [];
                self.selectedGames = data.apps.map(function(ea){
                    self.selectedGameFields[ea.appid] = {};
                    console.log(ea);

                    if (ea.fields) {
                        Object.keys(ea.fields).forEach(function (a) {
                            if (a == 'Skill Level'){
                                return self.selectedGameFields[ea.appid][a] = ea.fields[a][0];
                            }

                            self.selectedGameFields[ea.appid][a] = ea.fields[a];
                        });
                    }

                    return {
                        display: ea.name,
                        value: ea.name.toLowerCase(),
                        appid: ea.appid,
                        fields: ea.fields,
                        fieldoptions: ea.fieldoptions
                    }
                });
                /*self.selectedGameFields = data.apps.map(function(ea){
                    return {
                        display: ea.name,
                        value: ea.name.toLowerCase(),
                        appid: ea.appid,
                        fields: ea.fields
                    };
                });*/
                self.posttext = data.text;
                self.chipCount['game'] = self.selectedGames.length;
                self.chipCount['communication'] = self.selectedCommunications.length;

                if (data.reddit){
                    self.reddit = data.reddit;
                    self.allowReddit  =true;
                }


            },function(){

            })


        },function(){

        });



        /**
         * Return the proper object when the append is called.
         */

        $scope.$watch(watchSearchExpression, searchListenerFn);

        function watchSearchExpression(){
            return self.searchTextGame;
        }

        function searchListenerFn(nV,oV){
            if (nV == oV) {                                     // dont call server if search term is the same
                return;
            }

            if (!nV){                                                // empty strings evaluate to false. if newvalue is empty but previous value was not
                nV = 'displayall';                                   // therefore, prevent going to the fetchgames route with no params because that brings up the search sessions history
            }

            console.log(nV);

            if (nV.length < 2){
                return;
            }
            gameResource.getGames(nV, function (data) {
                    console.log(data);
                    self.games = loadGames(data);
                },
                function (err) {
                    self.games=[];
                }
            );
        }

        function memberEditAndBump(){

            var mmddyyyy,birthdate,reg,checker,validDateDifference,checker;

            /** form validators **/
            if (self.selectedGames.length == 0 ){
                return toast.triggerToast({},'You haven\'t selected any games.','postformController','warning-toast','.user-posts-toast',3000);
            }

            if (!self.posttext){
                return toast.triggerToast({},'Post text required','postformController','warning-toast','.user-posts-toast',3000);
            }

            if (self.steamid.length <17){
                return toast.triggerToast({},'Please enter SteamID in proper format.','postformController','warning-toast','.user-posts-toast',3000);
            }

            if (self.selectedItemLanguage == null){                                                 // when theres a selection ("X" button shows) but no text
                return toast.triggerToast({},'Please SELECT a language from the dropdown.','postformController','warning-toast','.user-posts-toast',3000);
            }

            if (self.selectedItemRegion == null){                                                   // when theres a selection ("X" button shows) but no text
                return toast.triggerToast({},'Please SELECT a region from the dropdown.','postformController','warning-toast','.user-posts-toast',3000);
            }

            if (self.selectedItemCountry == null){                                                  // when theres a selection ("X" button shows) but no text
                return toast.triggerToast({},'Please SELECT a country from the dropdown.','postformController','warning-toast','.user-posts-toast',3000);

            }

            if (self.allowReddit && !self.reddit){
                return toast.triggerToast({},'Please enter a valid Reddit username.','postformController','warning-toast','.user-posts-toast',3000);
            }


            if (self.birthdate){
                mmddyyyy = self.birthdate ? self.birthdate.split('/'): [];
                birthdate = new Date(mmddyyyy[2],[mmddyyyy[0]-1],mmddyyyy[1]);

                validDateDifference = ((new Date() - birthdate)/(1000*60*60*24*365)) <= 100;

                reg = new RegExp('\\d{1,2}/\\d{1,2}/\\d{4}');

                checker = self.birthdate.match(reg);

                if (!checker || !validDateDifference || !(mmddyyyy[2] <= new Date().getFullYear()) || !(mmddyyyy[1] <= 31) || !(parseInt(mmddyyyy[0]) <= 12)){
                    return toast.triggerToast({},'Please enter the date in proper format.','warning-toast','.user-posts-toast',3000);
                }
            }

            /** form validators end **/

            var apps = self.selectedGames.map(function(ea){
                if (self.selectedGameFields[ea.appid]) {
                    self.selectedGameFields[ea.appid]['Skill Level'] = [self.selectedGameFields[ea.appid]['Skill Level']];   // because its the only ng-model equalling to a string, put it in array.
                }
                return {
                    name: ea.display,
                    appid: ea.appid,
                    fields:  self.selectedGameFields[ea.appid]
                }
            });

            var communications = self.selectedCommunications.map(function(ea){
                return ea.display;
            });

            var formData = {
                submittedOn: new Date(),
                steamid: self.steamid,
                author: self.author || self.alias,
                apps: apps,
                reddit: self.reddit,
                email: self.email,
                text: self.posttext,
                language: self.selectedItemLanguage.display,
                region: self.selectedItemRegion.display,
                country: self.selectedItemCountry.display,
                birthdate: birthdate,
                communications : communications,
                gender: self.gender,
                passcode: self.passcode,
                loggedin: true,
                haspost:true   /**  lets the app know if user has a post already or not; used primarily in  the posts page to change certain buttons **/
            };

            postResource.memberEditAndBump(self.steamid,formData,function(){
                    /** some toast success here **/
                    $state.go('wantstoplay')
                },
                function(err){
                    /** failure toast **/
                    return toast.triggerToast({},err.data,'postformController','warning-toast','.user-posts-toast',3000);
                });
        }

        function addCount (fieldname){
            /** at this poitn the chip is already added **/

            var pool;

            if (fieldname !== "country"){
                pool = self["selected"+fieldname.substring(0,1).toUpperCase()+fieldname.substring(1)+"s"];      // get the chips array
            }  else {
                pool = self["selected"+fieldname.substring(0,1).toUpperCase()+fieldname.substring(1,6)+"ies"];      // get the chips array
                console.log(pool);
            }

            self.chipCount[fieldname] = self.chipCount.hasOwnProperty(fieldname) ? self.chipCount[fieldname]:pool.length-1; // set the chip count to chips array length - 1 or the existing property (-1 because
                                                                                                                            // we do the addition ++1 at the end. do not want a redundant addition
            if (pool.length > 1) {                                                                                          // whenever "all" is in the array size greater than 1, purge it. (makes no sense to have
                var exitContext = pool.some(function (ea, i) {                                                              // any option PLUS an "all" as "all" includes everything.)
                    if (ea.value == "all") {
                        return pool.splice(i, 1);
                    }
                });

                if (exitContext) {                                                                                          // if "all" is purged we exit context immediately because the chipscount should stay the same.
                    return;
                }
            }

            self.chipCount[fieldname]++;                                                                                    // all other cases we add +1.
            console.log(self.chipCount[fieldname])
        }

        function deleteCount (fieldname){

            var pool = self["selected"+fieldname.substring(0,1).toUpperCase()+fieldname.substring(1)+"s"];                // initialization for the chipsCount[fieldname] is required when our very first action is a delete.
            self.chipCount[fieldname] = self.chipCount.hasOwnProperty(fieldname) ? self.chipCount[fieldname]:pool.length+1;
            self.chipCount[fieldname]--;
        }

        function toggleMinimize(){
            self.minimizeAdditionalState = false;
            return self.minimizeState= !self.minimizeState;
        }

        function toggleAdditional(){
            return self.minimizeAdditionalState = !self.minimizeAdditionalState;
        }

        function transformChip(chip) {
            // If it is an object, it's already a known chip
            if (angular.isObject(chip)) {
                return chip;
            }

            // Otherwise, create a new one
            return { name: chip};
        }

        /*   function querySearch (query, pool) {
         return query ? pool.filter(createFilterFor(query)) : [];
         }

         function createFilterFor(query) {
         var lowercaseQuery = angular.lowercase(query);

         return function filterFn(item) {
         return item._lowername.indexOf(lowercaseQuery) >= 0;
         };

         }*/

        function loadGames(arr){
            var modifiedArr = arr.map(function(ea){
                return {
                    name:ea.name,
                    appid: ea.appid,
                    fields: ea.fields
                }
            });
            return selectmethods.mapToObj(modifiedArr,true, true);
        }

        function loadRegions() {

            return selectmethods.mapToObj(selectoptions.regions);
        }

        function loadLanguages() {
            return selectmethods.mapToObj(selectoptions.languages);
        }

        function loadCommunications(){
            return selectmethods.mapToObj(selectoptions.communications);
        }

        function loadCountries(){
            return selectmethods.mapToObj(selectoptions.countries);
        }

        function loadGenres(){
            var genres = ["Action","Adventure","MMORPG","Role Playing Game","Simulation","Strategy","Sports","MOBA", "FPS"];
            return selectmethods.mapToObj(genres,true);
        }

        function capitalize(str){
            if (!str){
                return
            }
            var strSplit = str.split(" ");
            strSplit.forEach(function(ea,i){
                strSplit[i] = ea.charAt(0).toUpperCase()+ea.slice(1);
            });

            return strSplit.join(" ");
        }

        function checkPasscodeBump(){
            var data = {
                uniqueKey: self.uniqueKey
            };

            postResource.checkPasscodeBump(data.steamid, data, function(data){
                if (data.verified){
                    $state.go('wantstoplay');
                } else {
                    /** do a toast **/
                }
            },function(){

            })
        }

        function parseDate(date){
            month = date ? new Date(date).getMonth() + 1 : undefined;

            if (month) {
                if (("" + month).length == 1) {
                    month = "0" + month;
                }
            }

            day = date ? new Date(date).getDate() : undefined;

            if (day) {

                if (("" + day).length == 1) {
                    day = "0".concat(day);
                }
            }

            var rawyear = date? new Date(date).getFullYear() : undefined;

            return month ? month + "/" + day + "/" + rawyear : "";
        }

    }
})();