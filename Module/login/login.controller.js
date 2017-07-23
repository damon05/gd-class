'use strict';

angular.module('app')
    .controller('loginSafeCtrl', function ($scope,$state,enume,$rootScope) {

        $rootScope.userName = "";
        $rootScope.menuCtrl = false;

        $scope.error = false;
        $scope.errorMsg = "";

        $scope.name = "";
        $scope.pwd = "";

        $scope.loginType = "1";

        $scope.login = function(){

            if($scope.name == "" || $scope.pwd == ""){
                $scope.error = true;
                $scope.errorMsg = "账号,密码都不允许为空!";
                return;
            }

            enume.postData("/cmsapi/login/tanentDoLogin?sqzh="+$scope.name+"&password="+$scope.pwd+"&type=1",null,function(d){
                $scope.error = false;
                enume.init();
                $state.go("safeRoom.homeworkList");

                $rootScope.userName = d.xxmc;
            })
        }

        document.querySelector("#pwd").addEventListener("keyup",function(e){
            var code = e.keyCode;
            if(code == 13){
                $scope.login();
            }
        },false);
    })
