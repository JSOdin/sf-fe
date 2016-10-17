(function() {
    'use strict';

    angular.module('myapp', ['ui.router', 'ngResource', 'ngAnimate','ngMaterial','angular-google-adsense']).config(['$httpProvider','$stateProvider','$urlRouterProvider', '$compileProvider','$locationProvider','$mdThemingProvider','$injector','$logProvider',AppSettings]);
    angular.module('myapp').run(['$rootScope','$state','$cacheFactory','userResource','$window','$document',function ($rootScope, $state, $cacheFactory,userResource,$window,$document) {                                                                                               // runs after app.config

       /* $rootScope.$on('ngFBReady', function(e, d){
            console.log("FB defined, running init.");
            if (FB) {
                FB.init({
                    appId: '659548270853016',
                    status: true,
                    xfbml: true,
                    version: 'v2.5'
                });
            }
        });

        // Trigger the polling loop in the service
        FBChecker.fbReady();*/
        // we know that when angular loads on the popup window that the reddit callback succeeded //
        console.log(document.referrer);

        try {           //* try...catch for preventing script halting because $window.opener access not allowed if opened from a third party website that opens a new window **/
            if ($window.opener && ($window.opener.location.origin==$window.location.origin)){                         // when small window popup for reddit auth, send a message to the main window.

                $window.opener.postMessage('success', $window.location.origin); // send a message from small window to main window.
                $window.close();
            }
        } catch(e){
            if (e.code !== 18){
                console.error(e.message);
            }
        }

        $cacheFactory('myCache');
        $rootScope.$state = $state;

        $rootScope.description = 'Steam Friends is a platform that helps you search for new users to play with. Filter by game name, and various user criteria.';
        $rootScope.title = 'Steam User Search Platform';


        $rootScope.overlaytrigger=false;

        $rootScope.$on('newPageLoaded',function(event,metadata){

             var meta = angular.element(document.querySelector('.metadescrip'));

             meta.attr('content',metadata.description);
            /*$rootScope.description=metadata.description;*/

            $rootScope.title = metadata.title;
        });

        $rootScope.$on('$stateChangeSuccess',function(ev, to, toParams, from, fromParams){

            $rootScope.previousState = from.name;
            window.prerenderReady = true;
        });

        /*userResource.getUser('thisuser',function(thisuser){
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (toState.data) {

                    /!*var hasDota = gameCheck(thisuser,570),
                        hasCSGO = gameCheck(thisuser,730),*!/
                    var readyDota = thisuser.settings.admin.appcheck.dota,                                                                // this setting is always false. only used to trigger route to form.
                        readyCSGO = thisuser.settings.admin.appcheck.csgo;                                                                // this setting is always false. only used to trigger route to form.

                   /!* if ((hasDota && hasCSGO) && ( (!readyDota || !readyCSGO) || (!readyDota && !readyCSGO))) {                                      // has both games and missing either or both setting
                        return
                    }*!/

                    if ((readyDota && readyCSGO) && !thisuser.settings.admin.submittedgameprofile){
                        return
                    }

                    if ((readyDota || readyCSGO) && !thisuser.settings.admin.submittedgameprofile) {                                                                        // has just one game and missing the respective setting
                        return;
                    }

                    event.preventDefault();                                                                                                        // all other cases: 1) has both games and both settings

                    return $state.go('games');                                                                                                     //                  2) has one game and the respective setting
                }                                                                                                                               //                  3) has neither game
            })
        })*/

    }]);

    function AppSettings ($httpProvider, $stateProvider, $urlRouterProvider, $compileProvider, $locationProvider, $mdThemingProvider,$injector, $logProvider) {


        $httpProvider.defaults.cache = false;
        if (!$httpProvider.defaults.headers.get) {                                              // $http caching issue for IE ; it tries to cache old data by default
            $httpProvider.defaults.headers.get = {};
        }
        // disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
        //.....here proceed with your routes

      /*  $mdThemingProvider.theme('default')
            .primaryPalette('teal');
*/
        $mdThemingProvider.theme('docs-dark')
            .primaryPalette('blue-grey')
            .dark();

        $mdThemingProvider.definePalette('customPalette',{
            '50': '1e2748',
            '100':'1e2748',
            '200':'1e2748',
            '300':'1e2748',
            '400':'1e2748',
            '500':'1e2748',
            '600':'1e2748',
            '700':'1e2748',
            '800':'1e2748',
            '900':'161d36',
            '1000':'0f1424',
            'A100':'515F91',
            'A200':'303F74',
            'A400' : '172557',
            'A700':'07123A',
            'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
            // on this palette should be dark or light
            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                '200', '300', '400', 'A100']
        });


        /*$mdThemingProvider.definePalette('customPalette',{
            '50': '5d72bc',
            '100':'4b62b4',
            '200':'4358a2',
            '300':'3c4290',
            '400':'34457e',
            '500':'303f74',
            '600':'2d3b6c',
            '700':'25315a',
            '800':'1e2748',
            '900':'161d36',
            '1000':'0f1424',
            'A100':'515F91',
            'A200':'303F74',
            'A400' : '172557',
            'A700':'07123A',
            'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
            // on this palette should be dark or light
            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                '200', '300', '400', 'A100']
        });*/

        $mdThemingProvider.theme('customTheme').primaryPalette('customPalette');

        $mdThemingProvider.setDefaultTheme('customTheme');
         $locationProvider.html5Mode({                   // get rid of pound sign in URL. need to use together with <base href="/"> in index.html
            enabled: true
        });
/*
        $locationProvider.hashPrefix('!');*/

        $stateProvider.state('friends', {
            url: '/friends',
            templateUrl: '/partials/friends',
            controller: 'friendsController as friendsCtrl'
        });


        $stateProvider.state('initialsetup',{
            url:'/initialsetup',
            templateUrl: '/partials/initialsetup',
            controller: 'initialsetupController as initialsetupCtrl'
        });

       /* $stateProvider.state('profilesetup', {
            url: '/profilesetup',
            templateUrl: '/partials/signup',
            data: {

            },
            controller: 'signupController as signupCtrl'
        });*/

        $stateProvider.state('privatesettings', {
            url: '/privatesettings',
            templateUrl: '/partials/privatesettings',
            controller: 'signupprivateController as signupprivCtrl'
        });

        $stateProvider.state('games', {
            url: '/find-steam-games',
            templateUrl: '/partials/games'


        });

        $stateProvider.state('users', {
            url: '/find-steam-friends',
            templateUrl: '/partials/users'
        });

        $stateProvider.state('searchbygame',{
            url:'/find-steam-friends/:game',
            templateUrl: '/partials/users'
        });

        $stateProvider.state('user', {
            url: '/find-steam-friend/:id',
            templateUrl: '/partials/user',
            controller: 'userController as userCtrl'
        });

        $stateProvider.state('error', {
            url: '/error',
            templateUrl: '/partials/error'
        });

        $stateProvider.state('conversations',{
            url:'/conversations',
            templateUrl: '/partials/conversations',
            controller: 'conversationController as convoCtrl'
        });

        $stateProvider.state('convo',{
            url:'/conversation/:id',
            templateUrl:'/partials/conversation',
            controller: 'singleConvoController as sconvoCtrl'
        });

        $stateProvider.state('settings',{
            url:'/settings',
            templateUrl:'/partials/settings',
            controller: 'settingsController as settingsCtrl'
        });

        $stateProvider.state('notifications',{
            url:'/notifications',
            templateUrl:'/partials/notifications',
            controller: 'notificationController as notificationCtrl'
        });

        privacyCtrl.$inject=['$scope'];

        $stateProvider.state('privacypolicy',{
            url:'/privacy-policy',
            templateUrl:'/partials/privacypolicy',
            controller: privacyCtrl
        });

        disclaimerCtrl.$inject=['$scope'];

        $stateProvider.state('disclaimer',{
            url:'/disclaimer',
            templateUrl:'/partials/disclaimer',
            controller:  disclaimerCtrl
        });

        $stateProvider.state('contactus',{
            url:'/contact-us',
            controller: 'contactusController as cntCtrl',
            templateUrl:'/partials/contactus'
        });

        aboutusCtrl.$inject=['$scope'];

        $stateProvider.state('aboutus',{
            url:'/about-us',
            templateUrl:'/partials/aboutus',
            controller:  aboutusCtrl
        });

        $stateProvider.state('how',{
            url:'/',
            templateUrl:'/partials/how',
            controller: 'howtoController as howCtrl'
        });

        $stateProvider.state('quickmatch',{
            url:'/quickmatch',
            templateUrl: '/partials/quickmatch',
            controller: 'quickmatchController as QMCtrl'
        });

        giveawayCtrl.$inject=['$sce','$scope'];

        $stateProvider.state('giveaways',{
            url:'/giveaway',
            templateUrl: '/partials/giveaway',
            controller: giveawayCtrl
        });

        $stateProvider.state('wantstoplay',{
            url:'/steam-user-posts',
            templateUrl: '/partials/wantstoplay',
            controller: 'wantstoplayController as wantsCtrl'
        });

        $stateProvider.state('postform',{
            url:'/submit-a-post',
            templateUrl: '/partials/postform',
            controller: 'postformController as postCtrl'
        });

        $stateProvider.state('managepost',{
            url:'/manage-post',
            templateUrl: '/partials/managepost',
            controller: 'managepostController as manageCtrl'
        });

        $stateProvider.state('manager',{
           url:'/CMSpanel',
           templateUrl: '/partials/admin',
            controller: 'cmsController as cmsCtrl'
        });

        $stateProvider.state('post',{
            url:'/posts/:id',
            templateUrl:'/partials/singlepost',
            controller: 'singlepostController as singleCtrl'
        });


        $urlRouterProvider.otherwise('/');

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|steam|mailto|file):/);                                             // whitelist any url start with "steam://" because browser deems it unsafe //

        function giveawayCtrl($sce,$scope){
            $scope.url = $sce.trustAsResourceUrl('https://widget-prime.rafflecopter.com/launch.js');
            !function(t){var e=t.document,c=e.createElement("script"),r=e.getElementsByTagName("script")[0],n={},i={};c.src="https://widget-prime.rafflecopter.com/load.js";var o={_configs:n,config:function(t,e){n[t]=e},_logins:i,login:function(t,e){i.creds=t,i.callback=e}};t.cptr&&t.cptr.widget||(t.cptr=t.cptr||{},t.cptr.widget=o),r.parentNode.insertBefore(c,r)}(window);

            //above script must be loaded in controller or else digest/render cycle wont pick up the code outside of it
        }

        function privacyCtrl($scope){
            /*   var meta = angular.element(document.querySelector('.metadescrip'));

             meta.attr('content','This privacy policy determines how Steam Friends utilizes information gathered from its users.');


             var title =  angular.element(document.querySelector('#main-title'));

             title.html("Steam Friends - Privacy Policy");*/

            $scope.$emit('newPageLoaded',{description:'This privacy policy determines how Steam Friends utilizes information gathered from its users.',title:'Privacy Policy'});
        }

        function disclaimerCtrl($scope){
            /*  var meta = angular.element(document.querySelector('.metadescrip'));

             meta.attr('content','This disclaimer outlines Terms of Use while using Steam Friends.');

             var title =  angular.element(document.querySelector('#main-title'));

             title.html("Steam Friends - Disclaimer");*/
             $scope.$emit('newPageLoaded',{description:'This disclaimer outlines Terms of Use while using Steam Friends.',title:'Disclaimer'});
        }

        function aboutusCtrl($scope){
            /*       var meta = angular.element(document.querySelector('.metadescrip'));

             meta.attr('content','About Steamfriends and what it is trying to achieve.');


             var title =  angular.element(document.querySelector('#main-title'));

             title.html("Steam Friends - About Us");*/

             $scope.$emit('newPageLoaded',{description:'About Steamfriends and what it is trying to achieve.',title:'About Us'});
        }
    }

   /* function gameCheck(User, appid) {                                                                                                      // check for existance of game in either ownedgames or recentlyplayed
      /!*  var ownedgames = [],*!/
        var recentlyPlayed = [];
        if (User) {
          /!*  ownedgames = User.ownedGames;*!/
            recentlyPlayed = User.recentlyPlayed;
        }
        /!*return ownedgames.some(function (ea, i) {
                return (ea.appid == appid);
            }) || recentlyPlayed.some(function (ea, i) {
                return (ea.appid == appid);
            });*!/

        return recentlyPlayed.some(function (ea, i) {
                return (ea.appid == appid);
            });
    }*/
})();