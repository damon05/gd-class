'use strict';

angular.module('app')
    .config(function ($stateProvider) {
        $stateProvider
            .state('loginSafe', {
                url: '/loginSafe',
                cache:false,
                templateUrl: "./Module/login/loginSafe.html",
                controller: 'loginSafeCtrl'
            })
    });
