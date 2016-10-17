(function(ng){
    'use strict';

    angular.module('myapp').controller('wantstoplayController',WantstoplayController);

    WantstoplayController.$inject = ['selectoptions','selectmethods','$scope','gameResource','postResource','userResource','$state','$http','$window','$location','$interval','toast','paginationCache','$rootScope','$anchorScroll','$q'];

    function WantstoplayController(selectoptions, selectmethods,$scope,gameResource, postResource, userResource, $state, $http, $window, $location, $interval,toast,paginationCache,$rootScope,$anchorScroll, $q){

        var self = this;
      /*  $interval(function(){
            var expiry = $window.localStorage.getItem('redditAuthExpire');                  /!** track reddit tokens in localstorage **!/

            if (expiry){
                if (expiry < new Date().getTime()){                     /!** check if timestamp expired so the user has to reddit auth again **!/
                $window.localStorage.removeItem('redditAuthExpire');
                }
            }
        },1000*60*5);*/

        /** captcha **/

        $scope.$emit('newPageLoaded',{description:'Try finding a new Steam friend to play games with by looking through posts made by players or make a post yourself. Use the filter to find users with the same goals and motivations.',title:'Steam user posts'});
        $rootScope.overlaytrigger = false;
        self.readonly = false;
        self.selectedItem = null;
        self.searchTextGame = null;
        self.searchTextRegion=null;
        self.querySearch = selectmethods.createQueryResults;


        /** get the form options **/
        self.regions = loadRegions();
        /*self.games = loadGames();*/

        self.selectedGameFields = {};
        self.games = [];
        self.languages = loadLanguages();
        self.communications = loadCommunications();
        self.countries = loadCountries();
     /*   self.genres = loadGenres();*/

        /** pre-select fields on load **/
        self.selectedGames = [{display:"All",value:"all"}];   /* need default value or it throw an error */
        self.selectedRegions = [{display:"All",value:"all"}];  /* need default value or it throw an error */
        self.selectedLanguages = [{display:"All", value: "all"}];
        self.selectedCommunications =[{display:"All",value:"all"}];
        self.selectedCountries = [{display:"All",value:"all"}];
     /*   self.selectedGenres = [{display:"All",value:"all"}];*/

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
        self.openForm = openForm;
        self.managePost = managePost;
        self.bumpPost = bumpPost;
        self.filterPosts = filterPosts;
        self.resetFields = resetFields;
        self.sendreddit = sendreddit;
        self.submitredditmessage = submitredditmessage;
        self.closeredditbox = closeredditbox;
        self.paginateUp = paginateUp;
        self.paginateDown = paginateDown;
        self.openfullpost = openfullpost;

        self.paginateDownCheck = paginationCache.currentPage == 1;
        self.paginateUpCheck = paginationCache.itemsShown == paginationCache.totalItems;
  /*      self.toggleGameFields = toggleGameFields;
*/
        $rootScope.hideOverlay = function(){
            $rootScope.overlaytrigger=false;
            self.fullpostmodalAppear=false;
            self.messagemodalAppear = false
        };


        /**
         * Return the proper object when the append is called.
         */

        userResource.getUser('refreshuser',function(data){
            if (!data.settings){
                return;
            }
            self.loggedin = data.hasOwnProperty('settings');
            self.haspost = data.settings.haspost;
            self.steamid = data.steamid;
        });


            /** get posts **/

        postResource.getFrontPage(function(data){
            paginationCache.itemsShown = data.length-1;
            paginationCache.totalItems = data[data.length-1];

            self.paginateUpCheck = paginationCache.itemsShown == paginationCache.totalItems;

            data.splice(data.length-1,1);
            self.posts = data;
        },function(){

        });

        /** get posts end **/



        $scope.$watch(watchSearchExpression, searchListenerFn);

        function watchSearchExpression(){
            return self.searchTextGame;
        }

        function openForm(){
           return $state.go('postform');
        }

        function managePost(){
            return $state.go('managepost');
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
            return selectmethods.mapToObj(selectoptions.regions,true);
        }

        function loadLanguages() {
            return selectmethods.mapToObj(selectoptions.languages, true);
        }

        function loadCommunications(){
            return selectmethods.mapToObj(selectoptions.communications, true);
        }

        function loadCountries(){
            return selectmethods.mapToObj(selectoptions.countries,true);
        }

   /*     function loadGenres(){
            var genres = ["Action","Adventure","MMORPG","Role Playing Game","Simulation","Strategy","Sports","MOBA", "FPS"];
            return selectmethods.mapToObj(genres,true);
        }*/

        function bumpPost(){
            return postResource.memberBump(self.steamid,function(){
                return postResource.getFrontPage(function(data){
                    paginationCache.itemsShown = data.length-1;               // whenever u hit filter button, refresh the numbers
                    paginationCache.totalItems = data[data.length-1];
                    data.splice(data.length-1,1);
                    self.posts = data;
                },function(){

                });
            },function(){

            })
        }

        function filterPosts(paginationDirection){
            var fieldsobject ={},
                numkeys;
            angular.copy(self.selectedGameFields,fieldsobject);

            /** clean up form fields before sending **/

            Object.keys(fieldsobject).forEach(function(ea){  /** each app **/
                numkeys = Object.keys(fieldsobject[ea]);
                Object.keys(fieldsobject[ea]).forEach(function(each,i){    /** each key in each app **/
                    if (fieldsobject[ea][each].length == 0){
                        delete fieldsobject[ea][each];                      /** delete the key if array is empty **/
                    }

                    if ((i==(numkeys-1)) && (Object.keys(fieldsobject[ea]).length == 0)){ /** if on last iteration and app doesnt have any keys **/
                        delete fieldsobject[ea];
                    }
                })
            });

            var apps = self.selectedGames.map(function(ea){
                return {
                    name: ea.display,
                    appid: ea.appid
                }
            });

            var postData={
                apps: apps,
                region: self.selectedRegions,
                language: self.selectedLanguages,
                communications: self.selectedCommunications,
                country: self.selectedCountries
               /* genre: self.selectedGenres*/
            };

            if ((apps.length == 1) && apps[0].name == "All" ){
                delete postData.apps;
            }


            Object.keys(postData).forEach(function(ea){
                if (!postData[ea][0]){
                    return delete postData[ea];
                }

                if (postData[ea][0].value=='all'){
                   return delete postData[ea];
                }

                postData[ea]=postData[ea].map(function(each){
                    if (ea=='apps'){

                        return {
                            name: each.display,
                            appid: each.appid
                        }
                    }

                    return each.display;
                })

            });

            postData.fields = fieldsobject;

            if ((typeof +self.agelow === 'number') && (typeof +self.agehigh === 'number') && (self.agehigh>self.agelow)){
                postData['agerange'] = [new Date(new Date()-self.agelow* 365*24*60*60*1000), new Date(new Date()-((+self.agehigh+1)*365*24*60*60*1000))]; /** adding one to the high limit so we can $gt but not including the limit endpoint.  this calculation is the # of miliseconds passed from the 1970 Javascript start point to the birthdate **/
            }

            /*  $interval(function(){
             var expiry = $window.localStorage.getItem('redditAuthExpire');                  /!** track reddit tokens in localstorage **!/

             if (expiry){
             if (expiry < new Date().getTime()){                     /!** check if timestamp expired so the user has to reddit auth again **!/
             $window.localStorage.removeItem('redditAuthExpire');
             }
             }
             },1000*60*5);*/


            if (paginationDirection == "up"){               // paginating up
                paginationCache.currentPage+=1;
            } else if (paginationDirection == "down"){      // paginating down
                paginationCache.currentPage-=1;
            } else {                                    // when we hit the filter button
                paginationCache.currentPage = 1;
            }

            self.paginateDownCheck = paginationCache.currentPage == 1;

            var pagination = paginationDirection ? paginationCache.currentPage+'-'+paginationDirection : "";

            $location.hash('user-posts-section')
            $anchorScroll();

            return postResource.filterPosts(postData,pagination,function(data){
                if (!paginationDirection){
                    paginationCache.itemsShown = data.length-1;               // whenever u hit filter button, refresh the numbers
                    paginationCache.totalItems = data[data.length-1];
                }

                if (paginationDirection == 'up'){
                    paginationCache.itemsShown+=(data.length-1);
                }

                if (paginationDirection == 'down'){
                    paginationCache.itemsShown-=(paginationCache.itemsShown -(data.length-1));
                }

                self.paginateUpCheck = paginationCache.itemsShown == paginationCache.totalItems;

                data.splice(data.length-1,1);
                self.posts=data;
            },function(){
                self.posts=[];
            })
        }

        function resetFields(){
            self.selectedGames = [{display:"All",value:"all"}];   /* need default value or it throw an error */
            self.selectedRegions = [{display:"All",value:"all"}];  /* need default value or it throw an error */
            self.selectedLanguages = [{display:"All", value: "all"}];
            self.selectedCommunications =[{display:"All",value:"all"}];
            self.selectedCountries = [{display:"All",value:"all"}];
            self.agelow='';
            self.agehigh='';

            Object.keys(self.chipCount).forEach(function(ea){
               self.chipCount[ea] = 1;
            });
        }

        function sendreddit(username, steamusername){
            self.username = username;
            self.steamusername = steamusername;


            /** call to db to check if token expired **/

            $http.get('/posts/checktoken').then(function(){
                $rootScope.overlaytrigger=true;
                self.messagemodalAppear = true;             /** then we can start messaging **/
                self.fullpostmodalAppear = false;
            },function(){
                var screensize = screen.width*0.75;
                var positiony = (screen.height-500)/2;
                var positionx = (screen.width-screensize)/2;
                $window.open('auth/reddit','Send message to a reddit user','width='+screensize+',left='+positionx+',height=500,top='+positiony);
                $window.focus();
                $window.addEventListener('message',function(event){
                    self.messagemodalAppear = true; //  changes to $scope does not update DOM when inside an eventlistener so gotta $scope.$apply();
                    $rootScope.overlaytrigger=true;
                    self.fullpostmodalAppear = false;
                    $scope.$apply();
                });
            });
        }



        function submitredditmessage(){
             var redditmessage = {
                 username: self.username,
                 message: self.redditmessage,
                 subject: self.redditsubject
             };

            if (!self.redditmessage && !self.redditsubject){
                return toast.triggerToast({}, 'Message and Subject cant\'t be empty!','','warning-toast','.reddit-message-toast-box',3000);
            }

            if (!self.redditmessage){
               return toast.triggerToast({}, 'Message can\'t be empty!','','warning-toast','.reddit-message-toast-box',3000);
            }

            if (!self.redditsubject){
                return toast.triggerToast({}, 'Subject can\'t be empty!','','warning-toast','.reddit-message-toast-box',3000);
            }

            /** captcha **/

            var recaptcha = $window.grecaptcha;                                                                                     /* $window.grecaptcha; is populated by the google script **/
            if (recaptcha.getResponse(postResource.captchaWidget) === ""){
                return toast.triggerToast({}, 'Please verify that you are human.','','warning-toast','.reddit-message-toast-box',3000);
            }

            recaptcha.reset(postResource.captchaWidget);   /* we kill the validated state for the widget we just used */

            /**==== captcha end ====***/

            self.messagemodalAppear = false;
            $rootScope.overlaytrigger=false;

            self.redditmessage='';
            self.redditsubject='';

            $http.post('/posts/sendreddit',redditmessage).success(function(){
                /** some toast **/
             /*   return toast.triggerToast({}, 'Message sent successfully','','','.reddit-message-toast-box',3000);*/
            });
        }

        function closeredditbox(){
            self.messagemodalAppear=false;
            self.fullpostmodalAppear = false;
            $rootScope.overlaytrigger =false;
        }

        function paginateUp(){

            return filterPosts("up");
        }

        function paginateDown(){
            return filterPosts("down");
        }

        function openfullpost(post){
            self.currentfullpost = post;
            self.fullpostmodalAppear = true;
            $rootScope.overlaytrigger=true;
        }

       /* function toggleGameFields(){
            self.stateGameFields = !self.stateGameFields;
        }*/
   /*     $rootScope.$on('$stateChangeStart',function(){
           angular.extend(self, savestateService.scope);
        })*/


        /** note about ng-if vs ng-show **/

        /** ng-if removes elements from the DOM and thus removing $scope watchers, allowing a much higher performance than ng-show. ng-show keeps elements in the DOM and adds the class ng-hide to them and removes them as needed.
         * a drawback to ng-if is that it will rerun the controller code associated with the element. but for some things keeping ng-show is good because some elements may be big with many sub elements within them. for ex. the form additional options
         * is shown with ng-show for that reason
         */
    }
})(angular);