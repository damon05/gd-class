'use strict';

angular.module('app')
    .controller('templateListCtrl',function ($http,$scope,enume,$state) {})

    .controller('createTemplateCtrl', function ($http,$scope,enume,$state,$stateParams) {
        $scope.entity = $stateParams.entity;
    })

    .controller('lessonsListCtrl1', function ($http,$scope,enume,$state,$stateParams) {
        $scope.kcxlSafes = enume.kcxlSafe;
        $scope.kcxlSafeNum = "";

        $scope.list = [];

        $scope.getUrl = function(){
            return "/cmsapi/course/currentTeacherAuthKeCheng?xlbh="+$scope.kcxlSafeNum;
        }

        $scope.search = function(){
            $scope.$broadcast("searchByFilter");
        }

        $scope.directiveCallBack = function(d){
            $scope.list = d;
        }

        $scope.editItem = function(item){
            $state.go("safeRoom.lessonsEdit",{id:item.code});
        }
    })

    .controller('lessonsEditCtrl1', function ($http,$scope,enume,$state,$stateParams) {
        var id = $stateParams.id;

        $scope.showDialog = false;

        $scope.from = "";
        $scope.kcxlmc = "";
        $scope.kjdz = "";
        $scope.kcjj = "";
        $scope.kcnr = "";

        $scope.tmpId1 = "";
        $scope.tmpName1 = "";
        $scope.tmpId2 = "";
        $scope.tmpName2 = "";
        $scope.tmpId3 = "";
        $scope.tmpName3 = "";
        $scope.tmpId4 = "";
        $scope.tmpName4 = "";

        $scope.kcbz = "";
        $scope.jiaoan = "";
        $scope.kcjc = "";
        $scope.dmtkj = "";
        $scope.jjsysmjqd = "";
        $scope.kcsc = "";
        $scope.tiku = "";

        $scope.kcbh = "";
        $scope.kcmc = "";

        $scope.s1 = false;
        $scope.s2 = false;
        $scope.s3 = false;
        $scope.s4 = false;
        $scope.s5 = false;
        $scope.s6 = false;
        $scope.s7 = false;

        enume.getData("/cmsapi/course/queryCourseWenjuan?kcbh="+id,function(d){
            $scope.tmpId1 = d.teacherWenjuan;
            $scope.tmpName1 = d.teacherWenjuanName;
            $scope.tmpId2 = d.studentWenjuan;
            $scope.tmpName2 = d.studentWenjuanName;
            $scope.tmpId3 = d.ktzyWenjuan;
            $scope.tmpName3 = d.ktzyWenjuanName;
            $scope.tmpId4 = d.khzyWenjuan;
            $scope.tmpName4 = d.khzyWenjuanName;
            $scope.begin = new Date(d.showBegin);
            $scope.end = new Date(d.showEnd);
        })

        $scope.save =function(){
            enume.postData("/cmsapi/course/updateCourseWenjuan?kcbh="+id+"&teacherWenjuan="+$scope.tmpId1+"&studentWenjuan="+$scope.tmpId2+"&ktzyWenjuan="+$scope.tmpId3+"&khzyWenjuan="+$scope.tmpId4+"&otherWenjuan=&begin="+enume.getCDate($scope.begin)+"&end="+enume.getCDate($scope.end),null,function(){
                $state.go("safeRoom.lessonsList");
            })
        }

        $scope.selectTemplates = function(){
            $scope.$broadcast("getCkTemplates");
        }

        enume.getData("/cmsapi/course/detail?code="+id,function(d){
            $scope.kcxlmc = d.kcxlmc;
            $scope.kcbh = d.spbh;
            $scope.kcmc = d.ssmc;

            $scope.from = d.from;
            $scope.kjdz = d.keVideo;
            $scope.kcjj = d.spjj;
            $scope.kcnr = d.spnr;

            $("#img1").attr("src", d.proImg);

            if(d.kcbz){
                $scope.s1 = true;
            }
            if(d.jiaoan){
                $scope.s2 = true;
            }
            if(d.kcjc){
                $scope.s3 = true;
            }
            if(d.dmtkj){
                $scope.s4 = true;
            }
            if(d.jjsysmjqd){
                $scope.s5 = true;
            }
            if(d.kcsc){
                $scope.s6 = true;
            }
            if(d.tiku){
                $scope.s7 = true;
            }

            $scope.kcbz = d.kcbz;
            $scope.jiaoan = d.jiaoan;
            $scope.kcjc = d.kcjc;
            $scope.dmtkj = d.dmtkj;
            $scope.jjsysmjqd = d.jjsysmjqd;
            $scope.kcsc = d.kcsc;
            $scope.tiku = d.tiku;
        })

        var openTag = 0;
        $scope.getChooseTmps = function(d){
            if(d.length == 0){
                alert("请选择一个模板!");
                return;
            }
            d = d[0];
            if(openTag == 1){
                $scope.tmpId1 = d.code;
                $scope.tmpName1 = d.name;
            }
            if(openTag == 2){
                $scope.tmpId2 = d.code;
                $scope.tmpName2 = d.name;
            }
            if(openTag == 3){
                $scope.tmpId3 = d.code;
                $scope.tmpName3 = d.name;
            }
            if(openTag == 4){
                $scope.tmpId4 = d.code;
                $scope.tmpName4 = d.name;
            }
            $scope.showDialog = false;
        }

        $scope.showTmpDialog = function(num){
            if(num == 1){
                $scope.showDialog = true;
                openTag = num;
            }
        }
        $scope.closeDialog = function(){
            $scope.showDialog = false;
        }
    })


