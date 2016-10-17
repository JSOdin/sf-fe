(function(){
    'use strict';

    angular.module('myapp').controller('postformController', PostformController);

    PostformController.$inject = ['selectoptions','selectmethods','$scope','gameResource','userResource','toast','$state','$window','postResource'];

    function PostformController(selectoptions, selectmethods,$scope,gameResource, userResource,toast,$state, $window, postResource){
        var self = this,
            month,day;

        self.readonly = false;
        self.searchTextGame = null;
        self.searchTextRegion=null;
        self.querySearch = selectmethods.createQueryResults;

        self.allowReddit=false;

        /** default presets for non-logged in **/
        self.selectedGameFields = {};
       /* self.selectedItemLanguage = {display:'English', value:'english'};
        self.selectedItemRegion = {display:'NA West',value:'na west'};
        self.selectedItemCountry = {display:'United States',value:'united states'};*/
        self.gender = {display:"Male",value:"male"};

        /** get the form options **/
        self.regions = loadRegions();
        self.games = [];
        self.languages = loadLanguages();
        self.communications = loadCommunications();
        self.countries = loadCountries();
        self.genres = loadGenres();

        self.guid = guid();

        /** pre-select fields on load **/

        self.selectedGames = [];   /* need default value or it throw an error */
        self.selectedCommunications = [];

        /** getting form options **/

        userResource.getUser('refreshuser',function(data){      //** for logged in users only **/
            if (!(data.settings && data.settings.admin.generalpersonal)){                                           // this checks if user is logged in or not
                return;
            }

            self.steamid = data.steamid;
            self.selectedItemLanguage = data.personal.language ?  { display: capitalize(data.personal.language),value: data.personal.language } : '';
            self.selectedItemRegion = data.general.region ? {display: capitalize(data.general.region), value: data.personal.language}: '';
            self.selectedItemCountry = data.personal.country ? {display: capitalize(data.personal.country), value: data.personal.country} : '';
            self.author = data.personaname;
            self.gender = data.personal.gender;
            self.loggedin = data.hasOwnProperty('settings');

            month = data.personal.birthdate ? new Date(data.personal.birthdate).getMonth() + 1 : undefined;

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

            var rawyear = data.personal.birthdate ? new Date(data.personal.birthdate).getFullYear() : new Date(data.personal.birthdate).getFullYear(); /** nonsense **/

            self.birthdate = month ? month + "/" + day + "/" + rawyear : "";
            self.hasSteamID = self.steamid.length > 0;
            self.hasLanguage = self.selectedItemLanguage.display && self.selectedItemLanguage.display.length > 0;
            self.hasRegion = self.selectedItemRegion.display &&  self.selectedItemRegion.display.length > 0;
            self.hasCountry = self.selectedItemCountry.display && self.selectedItemCountry.display.length > 0;
            self.hasBirthdate = self.birthdate.length > 0;
            self.hasGender = self.gender && self.gender.length > 0;


        },function(){

        });

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
        self.submitPost = submitPost;

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


            if (nV.length < 2){
                return;
            }
            gameResource.getGames(nV, function (data) {

                    self.games = loadGames(data);

                },
                function (err) {
                    self.games=[];
                }
            );
        }

        function submitPost(){

            /** form validators **/
            if (self.selectedGames.length == 0 || self.selectedGames[0].display=="All"){
                return toast.triggerToast({},'You haven\'t selected any games.','postformController','warning-toast','.user-posts-toast',3000);
            }

            if (!self.posttext){
                return toast.triggerToast({},'Post text required','postformController','warning-toast','.user-posts-toast',3000);
            }

            if (self.steamid.length <17 || isNaN(self.steamid)){
                return toast.triggerToast({},'Please enter SteamID in proper format.','postformController','warning-toast','.user-posts-toast',3000);
            }

   /*         if (self.selectedItemLanguage == null){
                return toast.triggerToast({},'Please SELECT a language from the dropdown.','postformController','warning-toast','.user-posts-toast',3000);
            }

            if (self.selectedItemRegion == null){
                return toast.triggerToast({},'Please SELECT a region from the dropdown.','postformController','warning-toast','.user-posts-toast',3000);
            }

            if (self.selectedItemCountry == null){
                return toast.triggerToast({},'Please SELECT a country from the dropdown.','postformController','warning-toast','.user-posts-toast',3000);
            }*/

            if (self.allowReddit && !self.reddit){
                return toast.triggerToast({},'Please enter a valid Reddit username.','postformController','warning-toast','.user-posts-toast',3000);
            }


            if (self.birthdate){
                var mmddyyyy = self.birthdate ? self.birthdate.split('/'): [];
                var birthdate = new Date(mmddyyyy[2],[mmddyyyy[0]],mmddyyyy[1]);

                var validDateDifference = ((new Date() - birthdate)/(1000*60*60*24*365)) <= 100;

                var reg = new RegExp('\\d{1,2}/\\d{1,2}/\\d{4}');

                var checker = self.birthdate.match(reg);

                if (!checker || !validDateDifference || !(mmddyyyy[2] <= new Date().getFullYear()) || !(mmddyyyy[1] <= 31) || !(parseInt(mmddyyyy[0]) <= 12)){
                    return toast.triggerToast({},'Please enter the date in proper format.','','warning-toast','.user-posts-toast',3000);

                }
            }

            /** form validators end **/

            var apps = self.selectedGames.map(function(ea){
                if (self.selectedGameFields[ea.appid]){
                    var sgf = self.selectedGameFields[ea.appid];
                    Object.keys(sgf).forEach(function(a){
                        if (sgf[a] == null || !sgf[a] || (Array.isArray(sgf[a]) && sgf[a].length == 0) ){
                            delete sgf[a];
                        }
                    });
                }

                if (self.selectedGameFields[ea.appid] && (self.selectedGameFields[ea.appid]['Skill Level'] !== null) && (self.selectedGameFields[ea.appid]['Skill Level'] !== undefined)) {
                    self.selectedGameFields[ea.appid]['Skill Level'] = [self.selectedGameFields[ea.appid]['Skill Level']];   // because its the only ng-model equalling to a string, put it in array.
                } else {
                    if (self.selectedGameFields[ea.appid] ){
                        self.selectedGameFields[ea.appid]['Skill Level'] = '';
                        delete self.selectedGameFields[ea.appid]['Skill Level'];
                    }
                }

               return {
                   name: ea.display,
                   appid: ea.appid,
                   fields:  self.selectedGameFields[ea.appid] || {}
               }
            });

            var communications = self.selectedCommunications.map(function(ea){
                return ea.display;
            });

            self.selectedItemLanguage = self.selectedItemLanguage ? self.selectedItemLanguage : {};
            self.selectedItemRegion = self.selectedItemRegion ? self.selectedItemRegion : {};
            self.selectedItemCountry = self.selectedItemCountry ? self.selectedItemCountry : {};

            var formData = {
                submittedOn: new Date(),
                steamid: self.steamid,
                author: self.author || self.alias,
                apps: apps,
                communications : communications,
                reddit: self.reddit,
                email: self.email,
                text: self.posttext,
                language: self.selectedItemLanguage.display,
                region: self.selectedItemRegion.display,
                country: self.selectedItemCountry.display,
                birthdate: self.birthdate,
                gender: self.gender,
                passcode: self.passcode,
                loggedin: self.loggedin,
                haspost:true,   /**  lets the app know if user has a post already or not; used primarily in  the posts page to change certain buttons **/
                uniqueKey: self.guid
            };

            Object.keys(formData).forEach(function(ea){
                if (!formData[ea]){
                    delete formData[ea];
                }
            });

            var recaptcha = $window.grecaptcha;

            if (recaptcha.getResponse(postResource.captchaWidget) === ""){
                return toast.triggerToast({}, 'Please verify that you are human.','','warning-toast','.user-posts-toast',3000);
            }

            recaptcha.reset(postResource.captchaWidget);   /* we kill the validated state for the captch widget we just used*/

            userResource.submitPost(self.steamid,formData,function(){
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
            /*var regions = ['NA','EU','SA','SEA','AU'];*/

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

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

    }
})();