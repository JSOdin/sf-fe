(function(){
    'use strict';

    angular.module('myapp').controller('cmsController', CmsController);

    CmsController.$inject = ['$http','$scope'];

    function CmsController($http,$scope){
        var self = this;

        self.submit = submit;
        self.submitdata= submitdata;

        function submit(){
            var formdata ={
                user:self.user,
                pass:self.pass
            };
            $http.post('/panel',formdata).then(function(response){
                if (response.data.verified){
                    self.openpanel = true;
                    console.log('hello')
                }
            },function(){

            })
        }

        function submitdata(){
            var formdata={
                appid: self.appid,
                field: self.fieldname,
                values: self.values.split(",")
            };

            $http.post('/panel/write',formdata).then(function(data){
                console.log(data);
            },function(){

            });
        }
    }
})();