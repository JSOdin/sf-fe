(function(){
    'use strict';

    angular.module('myapp').filter('filterGender', FilterGender);

    FilterGender.$inject = [];

    function FilterGender(){                                                  // must often check for existence of "arr" because $digest cycle runs before the controller data is filled (the arr)
        return function (arr, genderSelection) {
            return arr ? arr.filter(function(ea){
                if (!genderSelection){                  // when users page first loads and model is set to "" for both genders
                    return ea;
                }

                var regex = new RegExp('^'+genderSelection);
                ea.personal = ea.personal || {};
                return ea.personal.gender == ea.personal.gender.match(regex);
            }):arr;
        }
    }
})();