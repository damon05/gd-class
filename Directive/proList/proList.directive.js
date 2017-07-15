/**
 * Created by wupeng5 on 2016/3/5.
 */


angular.module("app").directive("proList",function(){
    return {
        templateUrl:"./Directive/proList/proList.html",
        restrict:"EA",
        scope:{
            "chooseCallback":"=",
            "showAddBtn":"=",
            "showCk":"="
        },
        link:function(){},
        controller:function($http,$scope,enume,$state){
            $scope.proCate = "jf";
            $scope.jfs = [];
            $scope.jfNum = "";

            $scope.jsVersion = enume.jsVersion;
            $scope.syjsbbh = "";
            $scope.kcxls = enume.kcxl;
            $scope.kcxlsNum = "";

            $scope.proList = [];

            $scope.convertVersion = function(key){
                var d = $scope.jsVersion;

                var res = "";
                for(var i=0;i< d.length;i++){
                    if(d[i].code == key){
                        res = d[i].name;
                        break;
                    }
                }
                return res;
            }

            $scope.seachPros = function(){
                $scope.$broadcast("searchByFilter");
            }

            $scope.createPro = function(){
                $state.go("roomManage.createProduct",{entity:{tag:"add"}});
            }

            $scope.getUrl = function(){
                return "/cmsapi/course/query?kcxlbh="+$scope.kcxlsNum+"&syjsWersion="+$scope.syjsbbh;
            }

            $scope.directiveCallBack = function(valueFromDirective){
                $scope.proList = valueFromDirective;
            }

            $scope.editPro = function(item){
                $state.go("roomManage.createProduct",{entity:{tag:"edit",item:item}});
            }

            $scope.deletePro = function(item){
                enume.getData("xxxxx",function(d){
                    $scope.roomList = $scope.roomList.deleteByKey("id",item.lineid);
                })
            }

            $scope.previewPro = function(item){
                $state.go("roomManage.productPreview",{id:item.code});
            }

            $scope.getRemark = function(item){
                return jsCoreMethod.cutString(item.remark,5);
            }

            $scope.$on("getCkPros",function(e,d){
                var d = $scope.proList;
                var res = [];
                for(var i=0;i< d.length;i++){
                    if(d[i].ck){
                        res.push(d[i]);
                    }
                }
                //res = [{id:"aaaaaa",name:"2"},{id:"bbbbb",name:"2"}];
                $scope.chooseCallback(res);
            })
        }
    }
})