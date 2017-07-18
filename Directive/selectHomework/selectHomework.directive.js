/**
 * Created by wupeng5 on 2016/3/5.
 */


angular.module("app").directive("selectHomework", function () {
    return {
        templateUrl: "./Directive/selectHomework/selectHomework.html?v=1401",
        restrict:"EA",
        scope:{
            "chooseCallback":"=",
            "showAddBtn":"=",            
            "from":"="
        },
        link:function(){},
        controller: function ($http, $scope, enume, $state, $rootScope, $stateParams, ngDialog) {

            //初始化下拉框数据  模板分类,模板类型
            $scope.Title = "";
            $scope.CourseTitle = "";
            $scope.homeworkID = $stateParams.entity.homeworkID;
            $scope.statusID = -1;
            $scope.wxStatus = enume.wxStatus;
            $scope.wxHomeworkType = enume.homeworkType;
            $scope.homeworkType = -1;
            $scope.List = $scope.homeworkList;
            $scope.queryHomeworkID = "";
            
            //查询模板
            $scope.search = function(){
                $scope.$broadcast("searchByFilter");
            }

            $scope.getUrl = function(){
                return srvDomain + "/Homework/Index?homeworkTitle=" + $scope.Title + "&courseTitle=" + $scope.CourseTitle + "&status=" + $scope.statusID + "&type=0" + "&homeworkType=" + $scope.homeworkType + "&id=" + $scope.queryHomeworkID;
            }

       
            $scope.directiveCallBack = function(d){
                $scope.List = d;
            }

           

            $scope.getRemark = function(item){
                return jsCoreMethod.cutString(item.remark,5);
            }

            $scope.$on("getCkHomework", function (e, d) {
                var d = $scope.List;
                var res = [];
                for (var i = 0; i < d.length; i++) {
                    if (d[i].ck) {
                        res = res + d[i].ID + ",";
                    }
                }
                //res = [{id:"aaaaaa",name:"2222222"}];
                $scope.chooseCallback(res);
            })

            $scope.copyHomeworkItem=function(){
                var d = $scope.List;

             
                var res = "";
                for (var i = 0; i < d.length; i++) {
                    if (d[i].ck) {
                        res = res + d[i].ID + ",";
                    }
                }

                //$scope.chooseCallback(res);
                var tmp = {
                    homeworkID: $scope.homeworkID,
                    ids: res
                };
                var url = "";

                url = srvDomain + "/Homework/CopyHomework";


                enume.postData(url, tmp, function (d) {                    
                    $scope.chooseCallback(1);
                })
                
            }

            $scope.closeDialog = function () {
                $scope.chooseCallback(0);
            }

            $scope.closeSelect = function () {
                $scope.closeThisDialog(); //关闭弹窗
            }
        }
    }
})