/**
 * Created by wupeng5 on 2016/3/5.
 */

angular.module("app").directive("navigation",function(){
    return {
        templateUrl:"./Directive/navigation/navigation.html",
        restrict:"EA",
        scope:{
            "index":"="
        },
        link:function(){},
        controller:function($scope,$rootScope,enume,$state,$http){

            $rootScope.userFlag = "userSafe";//userAdmin

            $rootScope.rootShow = true;

            $rootScope.cls1 = "navbar_hover";
            $rootScope.cls3 = "";

            $scope.c1 = function(){
                $scope.cls1 = "navbar_hover";
                $scope.cls2 = "";
                $scope.cls3 = "";
            }

            $scope.c2 = function(){
                $scope.cls1 = "";
                $scope.cls2 = "navbar_hover";
                $scope.cls3 = "";
            }

            $scope.c3 = function(){
                $scope.cls1 = "";
                $scope.cls2 = "";
                $scope.cls3 = "navbar_hover";
            }

            $http.get("/cmsapi/user/currentUser").success(function(d){
                if(d.status.code == "3"){
                    if($rootScope.userFlag == "userSafe"){
                        $state.go("loginSafe");
                    }else{
                        $state.go("loginAdmin");
                    }
                }else{
                    if($rootScope.userFlag == "userSafe"){
                        $rootScope.userName = d.data.xxmc;
                        if(d.data.loginType == "teacher"){
                            $rootScope.menuCtrl = false;
                        }else{
                            $rootScope.menuCtrl = true;
                        }

                    }else{
                        $rootScope.userName = d.data.name;
                    }
                    enume.init();
                }
            })

            $scope.logout = function(){
                enume.postData("/cmsapi/login/logout",null,function(d){
                    if($rootScope.userFlag == "userSafe"){
                        $state.go("loginSafe");
                    }else{
                        $state.go("loginAdmin");
                    }
                })
            }
        }
    }
})