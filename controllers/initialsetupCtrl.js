(function(){
    'use strict';

    angular.module('myapp').controller('initialsetupController' , InitialController);

    InitialController.$inject = ['selectmethods','selectoptions','$state', 'usersResource','$mdToast','$scope','userStore', 'toast'];

    function InitialController(selectmethods,selectoptions,$state, usersResource, $mdToast, $scope,userStore, toast){
        var initialsetupCtrl = this;

        initialsetupCtrl.closeToast = function(){
            $mdToast.hide();
        };

        /** form options **/
        initialsetupCtrl.querySearch = selectmethods.createQueryResults;
        initialsetupCtrl.countries = selectmethods.mapToObj(selectoptions.countries);
        initialsetupCtrl.languages = selectmethods.mapToObj(selectoptions.languages);
        initialsetupCtrl.genres = selectmethods.mapToObj(selectoptions.genres);
        initialsetupCtrl.intents = selectmethods.mapToObj(selectoptions.intents);
        initialsetupCtrl.genders = selectmethods.mapToObj(selectoptions.genders);
        initialsetupCtrl.intents = selectmethods.mapToObj(selectoptions.intents);
        initialsetupCtrl.communications = selectmethods.mapToObj(selectoptions.communications);
        initialsetupCtrl.regions = selectmethods.mapToObj(selectoptions.regions);

        /** initial values **/
        initialsetupCtrl.selectedItemCountry = {display: "United States", value: "united states"};
        initialsetupCtrl.selectedItemLanguage = {display: "English", value: "english"};
        initialsetupCtrl.gender = "male";
        initialsetupCtrl.genre = "action real time strategy";
        initialsetupCtrl.intent = "casual play";
        initialsetupCtrl.region = "na west";
        initialsetupCtrl.communication = "in game voice";
        /** end initial values **/

        initialsetupCtrl.submitAndGoNext = function(){
            var mmddyyyy = initialsetupCtrl.birthdate ? initialsetupCtrl.birthdate.split('/'): [];
            var birthdate = new Date(mmddyyyy[2],[mmddyyyy[0]],mmddyyyy[1]);

            var validDateDifference = ((new Date() - birthdate)/(1000*60*60*24*365)) <= 100;

            /** form input validator (firefox doesnt support HTML5 datepicker and only accept string**/

            var position = {
                left: false,
                right: true,
                bottom: false,
                top: true
            };

            if (!initialsetupCtrl.selectedItemCountry || !initialsetupCtrl.selectedItemLanguage|| !initialsetupCtrl.birthdate){
                var msg = 'Please fill in the missing fields';
                return toast.triggerToast(position, msg,'initialsetupController','warning-toast','.here',3000);
            }

            var reg = new RegExp('\\d{1,2}/\\d{1,2}/\\d{4}');

            var checker = initialsetupCtrl.birthdate.match(reg);

            if (!checker || !validDateDifference || !(mmddyyyy[2] <= new Date().getFullYear()) || !(mmddyyyy[1] <= 31) || !(parseInt(mmddyyyy[0]) <= 12)){
                var msgTwo = 'Please enter the date in valid format.';
                return toast.triggerToast(position,msgTwo,'initialsetupController', 'warning-toast','.here',3000);
            }

            var data = {
                general :{
                    preferredgenre: initialsetupCtrl.genre,
                    time: initialsetupCtrl.time,
                    intent: initialsetupCtrl.intent,
                    region: initialsetupCtrl.region
                },
                personal:{
                    language: initialsetupCtrl.selectedItemLanguage.value,
                    birthdate: birthdate,
                    gender: initialsetupCtrl.gender,
                    country: initialsetupCtrl.selectedItemCountry.value,
                    communication: initialsetupCtrl.communication
                }
            };

            /** validator end **/

            usersResource.submitInitial(data,function(){
                userStore.user.settings.admin.generalpersonal = true;
                $state.go('games');
            });

        }
    }
})();