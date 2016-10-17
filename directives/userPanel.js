// this directive manages a single user panel and its scope.

(function () {
    'use strict';

    angular.module('myapp').directive('userPanel', Userpanel);

        Userpanel.$inject = ['$window', '$http', 'userStore', '$rootScope', '$state', 'Dialog', 'toast'];

        function Userpanel($window, $http, userStore, $rootScope, $state, Dialog, toast) {

        return {


            restrict: 'E',
            replace: true,
            templateUrl: 'directives/userPanel.html',
            link: function userPanel(scope, element, attrs) {
                /*element.bind('click',function(){
                 scope.$apply($location.path('/users/profile/'+attrs.id));   // if u dont scope.$apply $location.path doesnt change the page. digest issue in directives? $apply runs angular digest when calling
                 });*/

                var dialog;

                if (userStore.user.hasOwnProperty('settings')) {
                    scope.blocked = scope.user.blocked.some(function(ea){
                        return userStore.user.steamid == ea;
                    });
                }

                element.bind(
                    'mouseenter', function(){                               //TODO implement highlights
                        element.addClass(attrs.highlightClass);
                    });

                element.bind('mouseleave', function(){                               //TODO implement highlights
                    element.removeClass(attrs.highlightClass);
                });

                /** functions **/

                scope.goToState = goToState;

                scope.addOnSteam = addOnSteam;

                scope.addFriend = addFriend;

                scope.cancelAddFriend = cancelAddFriend;

                function goToState(id, $event) {
                    $event.preventDefault();
                    if (scope.user.settings.user.profilePrivacy) {                    // if has privacy control enabled
                        if (userStore.user.hasOwnProperty('settings')) {             //if logged in
                            $state.go('user', {id: id});
                        } else {                                                    // not logged in
                            dialog = new Dialog.openModal($event, '', '/partials/privacymodal');
                            return dialog.show();
                        }
                    } else {
                        $state.go('user', {id: id});
                    }
                }

                function addOnSteam(url, $event) {
                        if (userStore.user.social) {
                            if (scope.blocked) {
                                dialog = new Dialog.openModal($event, 'messageController as msgCtrl', '/partials/blockedmodal');
                                return dialog.show();
                            }

                            toast.triggerToast({}, 'Added successfully. Check your Steam client.', 'usersController as usersCtrl', 'success-toast', '.users-toast', 3000);
                            return $window.location.href = url;
                        } else {
                            dialog = new Dialog.openModal($event, '', '/partials/loginmodal');
                            return dialog.show();
                        }
                }

                function addFriend(user, $event) {             // 'e' is $event
                        if (userStore.user.social) {
                            if (scope.blocked) {
                                dialog = new Dialog.openModal($event, 'messageController as msgCtrl', '/partials/blockedmodal');
                                return dialog.show();
                            }

                            scope.cancel = !scope.cancel;

                            return $http.post('/users/addfriend/' + user.steamid)
                                .then(function (data) {
                                    /* var element = angular.element(event.currentTarget);       // select the element that triggered the event (in this case is the add friend button)*/
                                    userStore.user.social.friends.pending.sent.push(data.data);
                                    $rootScope.$broadcast('newsentfriend');
                                    toast.triggerToast({}, 'Request sent.', 'usersController as usersCtrl', 'success-toast', '.users-toast', 3000);
                                }, function errorCallback(err) {
                                    console.log('here is the error:' + JSON.stringify(err));
                                })
                        } else {
                            var dialog = new Dialog.openModal($event, '', '/partials/loginmodal');
                            return dialog.show();
                        }
                }

                function cancelAddFriend(user) {
                    scope.cancel = !scope.cancel;
                    $http.get('/users/canceladdfriend/' + user.steamid)
                        .then(function () {
                            var sent = userStore.user.social.friends.pending.sent;
                            sent.some(function (ea, i) {
                                if (ea.steamid == user.steamid) {
                                    return sent.splice(i, 1);
                                }
                            });
                            $rootScope.$broadcast('requestcancel')
                            toast.triggerToast({}, 'Request Cancelled.', 'usersController as usersCtrl', 'success-toast', '.users-toast', 3000);
                        }, function errorCallback(err) {
                            console.log(err);
                        })
                }

                /** functions end **/

                scope.canAddOnSteam = true;                                               // by default when not logged in all buttons should show.

                if (userStore.user.hasOwnProperty('settings')) {                        // when logged in
                    if (userStore.user.social) {
                        scope.loggedinUser = userStore.user;

                        scope.cancel = userStore.user.social.friends.pending.sent.some(function (ea, i) {       // enable "cancel" button

                            return ea.steamid == scope.user.steamid;
                        });
                        scope.friend = userStore.user.social.friends.list.some(function (ea, i) {                // enable "friend" status button
                            return ea.steamid == scope.user.steamid;
                        });


                        scope.canAddOnSteam = scope.user.settings.user.addSteamSetting ? scope.friend : true;    // reevaluate steam add button appearance/disappearance

                        scope.$watch('loggedinUser.social.friends.list', function (newValue) {                  // watch the object to update the "friend" and "cancel" buttons
                            return scope.friend = newValue.some(function (ea, i) {
                                return ea.steamid == scope.user.steamid;
                            });
                        });

                      scope.$watch('loggedinUser.social.friends.pending.sent', function (newValue) {
                            return scope.cancel = newValue.some(function (ea, i) {
                                return ea.steamid == scope.user.steamid;
                            });
                        });
                    }

                }

            }
        }
    }
})();