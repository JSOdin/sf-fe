(function() {

    'use strict';

    angular.module('myapp').directive('navbar',Navbar);

    Navbar.$inject =  ['$http','userStore','$interval','$rootScope','userResource'];

    function Navbar($http,userStore, $interval,$rootScope, userResource) {
        return {
            restrict: 'E',
            scope: {
                loggedin: '=',
                user: '='
            },
            templateUrl: 'directives/navbar.html',
            link: function (scope, element, attrs) {
                scope.user = userStore.user;

                scope.$watch('user',function(nV,oV){

                    refreshNav(nV);
                },true);
                function refreshNav(nV){
                    if (nV.hasOwnProperty('settings')) {


                        scope.visible = (!nV.settings.admin.generalpersonal) || (!nV.settings.admin.submittedgameprofile);
                        scope.displayName = attrs.user;

                        scope.closeNotice = function(){
                            scope.visible = !scope.visible;
                            userResource.triggerSetting({},function(){
                                console.log('success');
                            },function(){

                            });
                        };

                        if (nV.conversations) {
                            scope.unreadMessagesCount = nV.conversations.filter(function (ea) {
                                return ea.read == false && (ea.messages.length > 0);
                            }).length;
                        }
                        if (nV.notifications) {
                            scope.unreadNoticesCount = nV.notifications.filter(function (ea) {
                                return ea.read == false
                            }).length;
                        }

                        $rootScope.$on('noticesread',function(){                                              // waits for when notices page is open
                            if (nV.notifications) {
                                scope.unreadNoticesCount = nV.notifications.filter(function (ea) {
                                    return ea.read == false;
                                }).length;
                            }
                        });

                        $rootScope.$on('convoread',function(){                                              // waits for when single convo page is open. then updates the unread messages count
                            if (nV.conversations) {
                                scope.unreadMessagesCount = nV.conversations.filter(function (ea) {
                                    return ea.read == false && (ea.messages.length > 0);
                                }).length;
                            }
                        });

                        scope.$watch(function () {                                                          // waits for whenever the user object is refreshed every 60 seconds in gameCtrl.
                            return userStore.user.conversations;
                        }, function (nV, oV) {
                            if (nV !== oV) {
                                if (nV.conversations) {
                                    scope.unreadMessagesCount = nV.conversations.filter(function (ea) {
                                        return ea.read == false && (ea.messages.length > 0);
                                    }).length;
                                }
                            }
                        },true);

                        scope.$watch(function () {                                                          // waits for whenever the user object is refreshed every 60 seconds in gameCtrl.
                            return nV.notifications;
                        }, function (nV, oV) {
                            if (nV !== oV) {

                                if (nV.notifications) {
                                    scope.unreadNoticesCount = nV.notifications.filter(function (ea) {
                                        return ea.read == false;
                                    }).length;
                                }
                            }
                        },true);
                    }

                }

            }
        }
    }
})();