(function(ng) {

    'use strict';

    angular.module('myapp').directive('recaptcha', Recaptcha);

    Recaptcha.$inject = ['$q','$window','postResource','$document'];

    function Recaptcha($q,$window, postResource,$document) {

        return {
            scope: {
                response: '=?ngModel',
                key: '=',
                stoken: '=?',
                theme: '=?',
                size: '=?',
                tabindex: '=?',
                onCreate: '&',
                onSuccess: '&',
                onExpire: '&'
            },
            link: function captcha(scope, element, attrs) {
                var deferred = $q.defer(), promise = deferred.promise, recaptcha;
                scope.setWidgetId = function(widgetId){
                    postResource.captchaWidget = widgetId;
                };

                $window.vcRecaptchaApiLoaded = function () {
                    recaptcha = $window.grecaptcha;

                    deferred.resolve(recaptcha);
                };

                function getRecaptcha() {
                    if (!!recaptcha) {
                        return $q.when(recaptcha);
                    }

                    return promise;
                }


                if (ng.isDefined($window.grecaptcha)) {
                    $window.vcRecaptchaApiLoaded();
                }
                var callback = scope.$watch('key',function(key){
                   if (!key){
                       return
                   }

                   return getRecaptcha().then(function (recaptcha) {
                       return postResource.captchaWidget = recaptcha.render('g-recaptcha', {
                           'sitekey': '6LfkLBYTAAAAAKCsb0DxW-pHs8lHedb6OPa__SSW',
                           /** 'expired-callback': someCallback **/
                           callback: callback
                       });
                   });
                });

                scope.$on('$destroy',function(){
                    angular.element($document[0].querySelectorAll('.pls-container')).parent().remove();
                })
            }
        }
    }
})(angular);

/** explanation **/

/** when the directive's element loads and the scope's property "key" gets populated with the captcha app key, render the captcha with the given callback and appkey, and save the widget key under a service
 in the callback we cancel the scope watching **/