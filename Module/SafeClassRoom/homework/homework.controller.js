'use strict';

angular.module('app')
    .controller('createHomeworkCtrl', function ($http, $scope, enume, $state, $stateParams) {
        $scope.ID = "";        
        $scope.Title = "";
        $scope.CourseTitle = "";
        $scope.showQuestion = false;
        $scope.teachingCode = $stateParams.entity.teachingCode;
        $scope.SchoolID = $stateParams.entity.schoolID;;
        $scope.homeworkID = $stateParams.entity.homeworkID;
        $scope.homeworkType = $stateParams.entity.homeworkType;
        $scope.KCBH = $stateParams.entity.KCBH;
        $scope.wxHomeworkScoreRule = enume.wxHomeworkScoreRule;

        $scope.data = {
            current: "1" // 1代表作业基本信息，2代表作业完成信息
        };

        $scope.actions =
            {
                setCurrent: function (param) {
                    $scope.data.current = param;
                }
            }

        function getInfoByCode() {
            var id = $stateParams.entity.homeworkID;
            enume.getData(srvDomain + "/Homework/Update?ID=" + id, function (item) {
                $scope.ID = item.ID;
                $scope.SchoolID = item.SchoolID;
                $scope.teachingCode = item.TeachingCode;
                $scope.KCBH = item.CourseCode;
                $scope.homeworkType = item.HomeworkType;
                $scope.Title = item.Title;
                if (item.FinishTime != null && item.FinishTime != "") {
                    $scope.FinishTime = new Date(Date.parse(item.FinishTime.replace(/-/g, "/")));
                }
                $scope.CreateBy = item.CreateBy;
                $scope.CreateTime = item.CreateTime;
                $scope.ModifyBy = item.ModifyBy;
                $scope.ModifyTime = item.ModifyTime;

            })
        }

        $scope.showButton = true;
        if ($stateParams.entity.tag == "edit") {
            $scope.t_title = "修改作业";
            getInfoByCode();
            $scope.showButton = true;
        }
        else if ($stateParams.entity.tag == "detail") {
            $scope.t_title =  "作业详情";
            getInfoByCode();
            $scope.showButton = false;           
        }
        else if ($stateParams.entity.tag == "addQuestion") {
            $scope.t_title = "修改作业";
            getInfoByCode();
            $scope.showButton = true;
            $scope.showQuestion = true;
        }
        else if ($stateParams.entity.tag == "detailQuestion") {
            $scope.t_title = "修改作业";
            getInfoByCode();
            $scope.showButton = false;
            $scope.showQuestion = true;
        }
        else {
            $scope.t_title = "添加作业";
            $scope.showButton = true;
        }

        $scope.gotoStepTwo = function () {
            // $state.go("safeRoom.homeworkCreate", { entity: { tag: "edit", homeworkID: item.ID, Type: $scope.Type } });
            if ($scope.ID == "")
            {
                alert("请先保存作业基本信息！");
            }
            else {
                $scope.showQuestion = true;
            }
            
        }

        $scope.gotoStepOne = function () {
            // $state.go("safeRoom.homeworkCreate", { entity: { tag: "edit", homeworkID: item.ID, Type: $scope.Type } });
            $scope.showQuestion = false;
        }

        $scope.backToHomeworkList = function () {
            $state.go("safeRoom.homeworkList", { entity: { Type: $scope.Type } });
        }

        $scope.createHomework = function () {

            var tmp = {
                SchoolID: $scope.SchoolID,
                TeachingCode:$scope.teachingCode,
                Title: $scope.Title,
                Type:0,//作业0 调查问卷1
                HomeworkType: $scope.homeworkType,
                CourseCode: $scope.KCBH,
                FinishTime: $scope.FinishTime,
                Remark: $scope.Remark
            };            

            var url = "";
            if ($stateParams.entity.tag == "edit") {
                var id = $stateParams.entity.homeworkID;
                url = srvDomain + "/Homework/Update";
                tmp.id = id;
            } else {
                url = srvDomain + "/Homework/Add";
            }
            enume.postData(url, tmp, function (d) {
                if ($stateParams.entity.tag == "add") {
                    alert("保存成功！");
                    $state.go("safeRoom.homeworkCreate", { entity: { tag: "edit", homeworkID: d } });
                }
                else {
                    alert("保存成功！");
                }

            })
        }
    })

    .controller('homeworkListCtrl', function ($http, $scope, enume, $state, $stateParams) {
        $scope.Type = $stateParams.entity.Type;
        
    })



  

