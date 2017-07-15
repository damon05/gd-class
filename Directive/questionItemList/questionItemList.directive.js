/**
 * Created by wupeng5 on 2016/3/5.
 */


angular.module("app").directive("questionItemList", function () {
    return {
        templateUrl: "./Directive/questionItemList/questionItemList.html?v=1306",
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
            $scope.questionID = $stateParams.entity.questionID;
            $scope.List = [];

            


            $scope.getUrl = function(){
                return srvDomain + "/QuestionItem/Index?questionID=" + $scope.questionID;
            }

            //查询数据
            $scope.$broadcast("searchByFilter");
            

            $scope.directiveCallBack = function(d){
                $scope.List = d;
            }

            $scope.edit = function (item) {
                $scope.tag = "edit";
                $scope.popTitle = "修改答案";
                $scope.selectedItem = item;
                ngDialog.open({
                    template: 'questionItemEditTmpl',
                    className: 'ngdialog-theme-default ngdialog-theme-dadao',
                    scope:$scope,
                    controller: function ($scope) {
                        $scope.save = function () {
                            if ($scope.selectedItem.Sort == "" || isNaN($scope.selectedItem.Sort)) {
                                alert("请输入排序（数字）");
                                return;
                            }
                            $scope.saveQuestionItem($scope.selectedItem);
                            $scope.closeThisDialog(); //关闭弹窗
                        }
                    }
                });
            };

            $scope.delete = function (item) {                
                if (confirm("确定要删除此项目吗？")) {
                    var tmp = {                        
                    };
                    var url = "";

                    var id = item.ID;
                    url = srvDomain + "/QuestionItem/Delete";
                    tmp.id = id;

                    enume.postData(url, tmp, function (d) {
                        alert("删除成功!");
                        $scope.$broadcast("searchByFilter");
                    })
                } 
            };

            $scope.createQuestionItem = function () {
                $scope.tag = "add";
                $scope.popTitle = "添加答案";
                $scope.selectedItem = { ID: "", Content: "", Sort: "", IsAnswer: false, QuestionID: $scope.questionID };

                ngDialog.open({
                    template: 'questionItemEditTmpl',
                    className: 'ngdialog-theme-default ngdialog-theme-dadao',
                    scope: $scope,
                    controller: function ($scope) {
                        $scope.save = function () {
                            if ($scope.selectedItem.Sort == "" || isNaN($scope.selectedItem.Sort)) {
                                alert("请输入排序（数字）");
                                return;
                            }
                            $scope.saveQuestionItem($scope.selectedItem);
                            $scope.closeThisDialog(); //关闭弹窗
                        }
                    }
                });
            };

            $scope.saveQuestionItem = function (item) {

                var tmp = {                    
                    QuestionID: item.QuestionID,
                    Content: item.Content,
                    IsAnswer: item.IsAnswer,
                    Sort: item.Sort
                };

                //var e = jsCoreMethod.validateEmail($scope.email,"请输入正常的的邮箱!");
                //if(e.bl == false){
                //    alert(e.msg);
                //    return;
                //}

                //if($scope.key != "" && $scope.key.length != 8){
                //    alert("加密密匙必须为8为数字字符或者符号组成!");
                //    return;
                //}

                var url = "";
                if ($scope.tag == "edit") {
                    var id =item.ID;
                    url = srvDomain + "/QuestionItem/Update";
                    tmp.id = id;
                } else {
                    url = srvDomain + "/QuestionItem/Add";
                }
                enume.postData(url, tmp, function (d) {                    
                        $scope.$broadcast("searchByFilter");                    
                })
            }

         

            $scope.getRemark = function(item){
                return jsCoreMethod.cutString(item.remark,5);
            }

            $scope.$on("getCkQeustionItems",function(e,d){
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