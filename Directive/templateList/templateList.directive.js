/**
 * Created by wupeng5 on 2016/3/5.
 */


angular.module("app").directive("templateList",function(){
    return {
        templateUrl:"./Directive/templateList/templateList.html",
        restrict:"EA",
        scope:{
            "chooseCallback":"=",
            "showAddBtn":"=",
            "showCk":"=",
            "from":"="
        },
        link:function(){},
        controller:function($http,$scope,enume,$state,$rootScope){

            //初始化下拉框数据  模板分类,模板类型
            $scope.templateCates =  enume.templateCateV2;
            $scope.templateTypes = enume.templateType;
            $scope.selectCate = "";
            $scope.selectType = "";
            $scope.templateName = "";
            $scope.beginDate = "";
            $scope.endDate = "";

            $scope.templateList = [];

            //查询模板
            $scope.templateListSearch = function(){
                $scope.$broadcast("searchByFilter");
            }

            $scope.createTemplate = function(){
                if($rootScope.userFlag == "userSafe"){
                    $state.go("safeRoom.templateCreate",{entity:{tag:"add",from:"safe"}});
                }else{
                    $state.go("roomManage.templateCreate",{entity:{tag:"add",from:"root"}});
                }
            }

            $scope.getUrl = function(){
                if($rootScope.userFlag == "userSafe"){
                    return "/cmsapi/template/query?category="+$scope.selectCate+"&type="+$scope.selectType + "&name="+$scope.templateName+"&begin="+ enume.getCDate($scope.beginDate)+ "&end="+ enume.getCDate($scope.endDate);
                }else{
                    return "/cmsapi/course/queryRootTemplate?category="+$scope.selectCate+"&type="+$scope.selectType + "&name="+$scope.templateName+"&begin="+ enume.getCDate($scope.beginDate) + "&end="+enume.getCDate($scope.endDate);
                }
            }

            $scope.directiveCallBack = function(d){
                $scope.templateList = d;
            }

            $scope.editTemplate = function(item){
                if($rootScope.userFlag == "userSafe"){
                    if(item.leaseholderId == "ROOT"){
                        alert("不允许修改教育机构创建的模板!");
                        return;
                    }
                }

                if($rootScope.userFlag == "userSafe"){
                    $state.go("safeRoom.templateCreate",{entity:{tag:"edit",code:item.code,from:"safe"}});
                }else{
                    $state.go("roomManage.templateCreate",{entity:{tag:"edit",code:item.code,from:"root"}});
                }
            }

            $scope.deleteTemplate = function(item){

                if($rootScope.userFlag == "userSafe"){
                    if(item.leaseholderId == "ROOT"){
                        alert("不允许删除教育机构创建的模板!");
                        return;
                    }
                }

                if(window.confirm("是否删除模板?")){
                    $http.get("/cmsapi/template/delete/"+item.id).success(function(d){
                        if(d.status.code == "1"){
                            $scope.templateList = $scope.templateList.deleteByKey("id",item.id);
                        }else{
                            alert(d.status.message);
                        }
                    })
                }
            }

            $scope.preView = function (item) {
                window.open("out.html?code="+item.code,"_blank","height=800,width=500");
            }

            $scope.goDetail = function(item){
                if($rootScope.userFlag == "userSafe"){
                    $state.go("safeRoom.templateCreate",{entity:{tag:"detail",code:item.code}});
                }else{
                    $state.go("roomManage.templateCreate",{entity:{tag:"detail",code:item.code}});
                }
             }

            $scope.getRemark = function(item){
                return jsCoreMethod.cutString(item.remark,5);
            }

            $scope.$on("getCkTemplates",function(e,d){
                var d = $scope.templateList;

                var res = [];
                for(var i=0;i< d.length;i++){
                    if(d[i].ck){
                        res.push(d[i]);
                    }
                }
                $scope.chooseCallback(res);
            })
        }
    }
})