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

            enume.postData("/cmsapi/login/tanentDoLogin?sqzh="+$scope.name+"&password="+$scope.pwd+"&type="+$scope.loginType,null,function(d){
                $scope.error = false;
                enume.init();
                $state.go("safeRoom.templateList");

                $rootScope.userName = d.xxmc;
                if(d.loginType == "teacher"){
                    $rootScope.menuCtrl = false;
                }else{
                    $rootScope.menuCtrl = true;
                }
            })
        }

        $scope.changeLogin = function(){
            $rootScope.userFlag = "userAdmin";
            $state.go("loginAdmin");
        }

        document.querySelector("#pwd").addEventListener("keyup",function(e){
            var code = e.keyCode;
            if(code == 13){
                $scope.login();
            }
        },false);
    })
