/**
 * Created by wupeng5 on 2016/3/5.
 */


angular.module("app").directive("homeworkList",function(){
    return {
        templateUrl: "./Directive/homeworkList/homeworkList.html?v=1925",
        restrict:"EA",
        scope:{
            "chooseCallback":"=",
            "showAddBtn":"=",
            "showCk":"=",
            "from":"="
        },
        link:function(){},
        controller: function ($http, $scope, enume, $state, $rootScope, $stateParams, ngDialog) {

            //初始化下拉框数据  模板分类,模板类型
            $scope.Title = "";
            $scope.CourseTitle = "";
            $scope.statusID = -1;
            $scope.homeworkType = -1;
            $scope.wxStatus = enume.wxStatus;
            $scope.wxHomeworkType = enume.homeworkType;           
            $scope.List = [];
            $scope.questionList = [];
            

            if ($scope.Type == "0")
            {
                $scope.TypeName = "作业";
            }
            else {
                $scope.TypeName = "问卷调查";
            }
            //查询模板
            $scope.search = function(){
                $scope.$broadcast("searchByFilter");
            }

            $scope.createHomework = function(){                
                $state.go("safeRoom.homeworkCreate", { entity: { tag: "add", from: "safe", teachingCode: "20161101205908881NAN2", schoolID: "BJ1001", homeworkType: 1 } });
               
            }

            $scope.createHomeworkTemplate = function () {
                $state.go("safeRoom.homeworkCreate", { entity: { tag: "add", homeworkType: 0, KCBH: "KC1009" } });
                
            }

            $scope.getUrl = function(){
                return srvDomain + "/Homework/Index?homeworkTitle=" + $scope.Title + "&courseTitle=" + $scope.CourseTitle + "&status=" + $scope.statusID + "&type=0" + "&homeworkType=" + $scope.homeworkType;
            }


            $scope.edit = function (item) {
                $scope.showButton = true;
                $state.go("safeRoom.homeworkCreate", { entity: { tag: "edit", homeworkID: item.ID, homeworkType: item.HomeworkType } });
            }

            $scope.detail = function (item) {
                $scope.showButton = true;
                $state.go("safeRoom.homeworkCreate", { entity: { tag: "detail", homeworkID: item.ID, homeworkType: item.HomeworkType } });
            }

            $scope.publish = function (item) {
                var alertMessage = "发布后不能再修改作业内容，确定要发布吗？";
                if ($scope.Type == "1") {
                    alertMessage = "发布后不能再修改调查问卷内容，确定要发布吗？";
                }
                if (confirm(alertMessage)) {
                    var tmp = {
                    };
                    var url = "";

                    var id = item.ID;
                    url = srvDomain + "/Homework/Publish";
                    tmp.id = id;

                    enume.postData(url, tmp, function (d) {                       
                            alert("发布成功!");
                            $scope.$broadcast("searchByFilter");                        
                    })
                }
            };

            $scope.delete = function (item) {
                if (confirm("确定要删除此项目吗？")) {
                    var tmp = {
                    };
                    var url = "";

                    var id = item.ID;
                    url = srvDomain + "/Homework/Delete";
                    tmp.id = id;

                    enume.postData(url, tmp, function (d) {                        
                            alert("删除成功!");
                            $scope.$broadcast("searchByFilter");                      
                    })
                }
            };

            $scope.copyItem = function (item) {
                $scope.tag = "copy";
                $scope.popTitle = "复制作业";
                $scope.selectedItem = item;
                $scope.selectedItem.newTeachingCode = "";
                ngDialog.open({
                    template: 'homeworkItemCopyTmpl',
                    className: 'ngdialog-theme-default ngdialog-theme-dadao',
                    scope: $scope,
                    controller: function ($scope) {
                        $scope.copyHomeworkItem = function () {
                            var tmp = {
                                homeworkID: $scope.selectedItem.ID,
                                newTeachingCode: $scope.selectedItem.newTeachingCode
                            };
                            var url = "";

                            url = srvDomain + "/Homework/CopyHomework";


                            enume.postData(url, tmp, function (d) {
                                alert("发布成功!");
                                $scope.$broadcast("searchByFilter");
                            })
                            $scope.closeThisDialog(); //关闭弹窗
                        }
                    }
                });
            };

            function getData(item) {
                var url = srvDomain + "/Homework/Preview?homeworkID=" + item.ID ;
                url = url + "&pageIndex=1&pageSize=1000&ran=" + Math.random();

                $http.get(url).success(function (d) {

                    if (d.status.code == "1") {
                        var tmp = d.data.datas;
                        $scope.questionList = tmp;
                    }
                    else {
                        alert(d.status.message);
                    }
                })
            }
      
            $scope.previewItem = function (item) {
                $scope.popTitle = "调查问卷预览";
                getData(item);                
                ngDialog.open({
                    template: 'questionPreviewTmpl',
                    className: 'ngdialog-theme-default ngdialog-theme-dadao',
                    scope: $scope                   
                });
            };

            $scope.directiveCallBack = function(d){
                $scope.List = d;
            }

           

            $scope.getRemark = function(item){
                return jsCoreMethod.cutString(item.remark,5);
            }

            $scope.$on("getCkHomeworks",function(e,d){
                var d = $scope.homeworkList;

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