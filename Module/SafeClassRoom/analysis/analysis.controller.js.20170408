angular.module('app')
    .controller('surveyAnalysisListCtrl', function ($http,$scope,enume,$state) {})
    .controller('surveyInfoListCtrl',function($http,$scope,enume,$state){})
    .controller('surveyAnalysisDetailCtrl',function($http,$scope,enume,$state,$stateParams){
        $scope.entity = {id:$stateParams.id};
    })
    .controller('surveyInfoDetailCtrl',function($http,$scope,$state,enume,$stateParams){
        $scope.entity = {id:$stateParams.id};
    })
    .controller('lessonsListCtrl', function ($http,$scope,enume,$state) {

        $scope.kcxl = enume.kcxlSafe;
        $scope.kcxlNum = "";

        $scope.kc = [{name:"全部",code:""}];
        $scope.kcNum = "";

        $scope.xn = [{name:"全部",code:"0"}];
        $scope.nj = [{name:"全部",code:""}];
        $scope.bj = [{name:"全部",code:""}];

        $scope.xnNum = "0";
        $scope.njNum ="";
        $scope.bjNum = "";

        $scope.bDate ="";
        $scope.eDate = "";

        $scope.downLink = "";
        $scope.btnCls = "btnGray";
        $scope.isDisabled = true;


        $scope.changeKcxl = function(){
            enume.getCurrentKeCheng($scope.kcxlNum,function(d){
                d = d.datas;
                $scope.kc = [{name:"全部",code:""}];
                for(var i=0;i< d.length;i++){
                    $scope.kc.push({name:d[i].name,code:d[i].kcxlbh});
                }
            })
        }

        enume.getXnByXx("",function(d){
            $scope.xn = [{name:"全部",code:"0"}];
            d = d.datas;
            for(var i=0;i< d.length;i++){
                $scope.xn.push({name:d[i],code:d[i]});
            }
        });
        $scope.changeXn = function(){
            enume.getNjByXn("",$scope.xnNum,function(d){
                $scope.nj = [{name:"全部",code:""}];
                for(var i=0;i< d.length;i++){
                    $scope.nj.push({name:d[i].njmc,code:d[i].njbh});
                }
            });
        }
        $scope.changeNj = function(){
            enume.getBjByXnAndNjBh("",$scope.xnNum,$scope.njNum,function(d){
                $scope.bj = [{name:"全部",code:""}];
                for(var i=0;i< d.length;i++){
                    $scope.bj.push({name:d[i].bjmc,code:d[i].bjbh});
                }
            });
        }

        $scope.bzzy = function (item) {
            $state.go("safeRoom.homeworkCreate", {
                entity: { tag: "add", from: "safe", Type: "0", teachingCode: item.skbh, schoolID: item.xxbh }
            });
        }

        function downFile(){
            $scope.downLink = "";
            $scope.btnCls = "btnGray";
            $scope.isDisabled = true;
            enume.getData("/cmsapi/teaching/log/download?xlbh="+$scope.kcxlNum+"&kcbh="+$scope.kcNum+"&xn="+$scope.xnNum+"&njbh="+$scope.njNum+"&bjbh="+$scope.bjNum+"&begin="+$scope.bDate+"&end="+$scope.eDate,function(d){
                $scope.btnCls = "btnGreen";
                $scope.downLink = "/file/"+d;
                $scope.isDisabled = false;
            })
        }

        downFile();

        $scope.showStudents = function(item){
            $state.go("safeRoom.students",{id:item.skbh});
        }

        $scope.getUrl = function(){
            return "/cmsapi/teaching/log/query?xlbh="+$scope.kcxlNum+"&kcbh="+$scope.kcNum+"&xn="+$scope.xnNum+"&njbh="+$scope.njNum+"&bjbh="+$scope.bjNum+"&begin="+$scope.bDate+"&end="+$scope.eDate;
        }

        $scope.directiveCallBack = function(valueFromDirective){
            $scope.lessonsList = valueFromDirective;
        }

        $scope.search = function(){
            $scope.$broadcast("searchByFilter");
            downFile();
        }

        $scope.goJsPingjia = function(code){
            $state.go("safeRoom.surveyInfoDetail",{id:code});
        }

        $scope.goXsPingjia = function(code){
            $state.go("safeRoom.surveyInfoDetail",{id:code});
        }
    })
    .controller('studentListCtrl', function ($http,$scope,enume,$state,$stateParams) {
        $scope.skbh = $stateParams.id;

        $scope.stuList = [];

        $scope.getUrl = function(){
            return "/cmsapi/teaching/log/student?skbh="+$scope.skbh;
        }

        $scope.directiveCallBack = function(valueFromDirective){
            $scope.stuList = valueFromDirective;
        }
    })