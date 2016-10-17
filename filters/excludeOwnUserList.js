(function () {
    'use strict';

    angular.module('myapp').filter('excludeself', ExcludeSelf);

    ExcludeSelf.$inject = ['userStore'];

    function ExcludeSelf(userStore) {    // User is the angular constant

        return function (input) {                             // angular $digest cycle runs before the value is populated from the controller, (including filter) so
            if (!input || !input.length || !userStore.user) {                  // we need to check if input is defined or User is logged in
                return input;
            }
            return input.filter(function (ea) {
                return ea.steamid != userStore.user.steamid;
            })
        }
    }
})();