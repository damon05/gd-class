/**
 * Created by wupeng5 on 2016/3/5.
 */


angular.module("app").directive("questionList",function(){
    return {
        templateUrl: "./Directive/questionList/questionList.html?v=1329",
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
            $scope.homeworkID = $stateParams.entity.homeworkID;
            $scope.Title = "";
            $scope.CourseTitle = "";
            $scope.statusID = -1;
            $scope.homeworkType = $stateParams.entity.homeworkType;
            $scope.wxStatus = enume.wxStatus;
            $scope.List = [];
            $scope.homeworkList = [];
            var selClass = null;

            $scope.getUrl = function () {
                return srvDomain + "/Question/Index?homeworkID=" + $scope.homeworkID;
            }
            //查询作业题目列表          
            $scope.$broadcast("searchByFilter");
            

            $scope.createQuestion = function () {
                $state.go("safeRoom.questionCreate", { entity: { tag: "add", from: "safe", homeworkID: $scope.homeworkID, homeworkType: $scope.homeworkType } });
            }


            $scope.edit = function (item) {
                $scope.showButton = true;
                $state.go("safeRoom.questionCreate", { entity: { tag: "edit", questionID: item.ID, homeworkID: item.HomeworkID, homeworkType: $scope.homeworkType } });
            }

            $scope.detail = function (item) {
                $scope.showButton = false;
                $state.go("safeRoom.questionCreate", { entity: { tag: "detail", questionID: item.ID, homeworkID: item.HomeworkID, homeworkType: $scope.homeworkType } });
            }

            $scope.delete = function (item) {
                if (confirm("确定要删除此项目吗？")) {
                    var tmp = {                        
                    };
                    var url = "";

                    var id = item.ID;
                    url = srvDomain + "/Question/Delete";
                    tmp.id = id;

                    enume.postData(url, tmp, function (d) {
                        alert("删除成功!");
                        $scope.$broadcast("searchByFilter");
                    })
                }
            };

   
            function getData() {
                var url = srvDomain + "/Homework/Index?homeworkTitle=" + $scope.Title + "&courseTitle=" + $scope.CourseTitle + "&status=" + $scope.statusID + "&type=0" + "&homeworkType=" + $scope.homeworkType;
                url = url + "&pageIndex=1&pageSize=1000&ran=" + Math.random();

                $http.get(url).success(function (d) {

                    if (d.status.code == "1") {
                        var tmp = d.data.datas;
                        $scope.homeworkList = tmp;
                    }
                    else {
                        alert(d.status.message);
                    }
                })
            }

            $scope.copyItem = function () {
                $scope.popTitle = "选择现有作业";
                getData();
                ngDialog.open({
                    template: 'questionCopyTmpl',
                    className: 'ngdialog-theme-tablelist',
                    closeByEscape: false,
                    closeByDocument: false,
                    scope: $scope
                });
            };
            

            $scope.directiveCallBack = function(d){
                $scope.List = d;
            }
            $scope.getSelectHomework = function (d) {
                $scope.$broadcast("getCkHomework");
            }
            $scope.getSelClass = function (d) {
                if (d == 1) {
                    ngDialog.close();
                    alert("添加成功!");
                    $scope.$broadcast("searchByFilter");
                }
                else {
                    ngDialog.close();
                }
            }

            $scope.getRemark = function(item){
                return jsCoreMethod.cutString(item.remark,5);
            }

            $scope.$on("getCkQeustions",function(e,d){
                var d = $scope.questionList;

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