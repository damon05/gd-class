'use strict';

angular.module('app')
    .controller('createQuestionCtrl', function ($http, $scope, enume, $state, $stateParams) {
        $scope.ID = "";        
        $scope.Title = "";
        $scope.Code = "";
        $scope.Score = "";
        $scope.Type = 0;
        $scope.Restype = 0;
        $scope.ResourceURL = "";
        $scope.showQuestionItem = false;
        $scope.questionID = $stateParams.entity.questionID;
        $scope.HomeworkID = $stateParams.entity.homeworkID;
        $scope.wxQuestionType = enume.wxQuestionType;
        $scope.wxQuestionResType = enume.wxQuestionResType;
        $scope.showImg = false;

        $scope.HomeworkType = $stateParams.entity.Type;


        function getInfoByCode() {
            var id = $stateParams.entity.questionID;
            enume.getData(srvDomain + "/Question/Update?ID=" + id, function (item) {
                $scope.ID = item.ID;
                $scope.HomeworkID = item.HomeworkID;                
                $scope.Title = item.Title;
                $scope.Code = item.Code;
                $scope.Score = item.Score;
                $scope.Type = item.Type;
                $scope.Restype = item.Restype;
                $scope.ResourceURL = item.ResourceURL;
                $scope.CreateBy = item.CreateBy;
                $scope.CreateTime = item.CreateTime;
                $scope.ModifyBy = item.ModifyBy;
                $scope.ModifyTime = item.ModifyTime;
                if(item.ResourceURL!=null && item.ResourceURL!="")
                {
                    $scope.showImg = true;
                }

            })
        }

        jsCoreMethod.fileUploadByFormAjax_wx("btnUploadImg", "images", function (d) {
            $scope.ResourceURL = d;
            $scope.r1 = "上传成功";
            $scope.$apply();
        }, 1000)

        $scope.showButton = true;
        if ($stateParams.entity.tag == "edit") {
            $scope.t_title = "修改题目";
            getInfoByCode();
            $scope.showButton = true;
            $scope.showQuestionItem = true;
            
        }
        else if ($stateParams.entity.tag == "detail") {
            $scope.t_title = "题目详情";
            getInfoByCode();
            $scope.showButton = false;
            $scope.showQuestionItem = true;
        }
        else {
            $scope.t_title = "添加题目";
            $scope.showButton = true;
        }

        $scope.backToHomework = function () {
            if ($stateParams.entity.tag == "detail") {
                $state.go("safeRoom.homeworkCreate", { entity: { tag: "detailQuestion", homeworkID: $scope.HomeworkID, homeworkType: $scope.homeworkType } });
            }
            else {                
                $state.go("safeRoom.homeworkCreate", { entity: { tag: "addQuestion", homeworkID: $scope.HomeworkID, homeworkType: $scope.homeworkType } });
            }
        }
        $scope.createQuestion = function () {

            var tmp = {
                HomeworkID: $scope.HomeworkID,
                Title: $scope.Title,
                Code: $scope.Code,
                Score: $scope.Score,
                Content: $scope.Content,
                Type: $scope.Type,
                Restype: $scope.Restype,
                ResourceURL: $scope.ResourceURL
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
            if ($stateParams.entity.tag == "edit") {
                var id = $stateParams.entity.questionID;
                url = srvDomain + "/Question/Update";
                tmp.id = id;
            } else {
                url = srvDomain + "/Question/Add";
            }
            enume.postData(url, tmp, function (d) {
                if ($stateParams.entity.tag == "add") {
                    $state.go("safeRoom.questionCreate", { entity: { tag: "edit", questionID: d, Type: $scope.HomeworkType } });
                }
                else
                {
                    alert("保存成功！");
                }
               
            })
        }
    })

    .controller('questionListCtrl',function ($http,$scope,enume,$state) {})



  

