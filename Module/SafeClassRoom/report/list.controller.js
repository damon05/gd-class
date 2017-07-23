'use strict';

angular.module('app')
    .controller('reportCtrl',function ($http,$scope,enume,$state) {

        $scope.homeWorks = enume.homeWorks;
        $scope.homeworkId = "0";
        $scope.beginDate = "";
        $scope.endTime = "";
        $scope.cardNo = "";
        $scope.cols = [
            {name:"工地名称",key:"tanentName"},
            {name:"身份证号码",key:"studentNo"},
            {name:"工人姓名",key:"studentName"},
            {name:"考试成绩",key:"score"},
            {name:"考试时间",key:"showCreateTime"}
        ];
        $scope.list = [];

        $scope.export = function(){
            var url = "/cmsapi/gd/homeworkWorkersItemReportExport?cardNo="+$scope.cardNo+"&homeworkId="+$scope.homeworkId
                +"&beginTime="+enume.getCDate($scope.beginDate)+"&endTime="+enume.getCDate($scope.endTime);
            window.open(url);
        }

        $scope.search = function(){
            if($scope.homeworkId == "0"){
                alert("请选择考卷!");
                return;
            }
            $scope.cols = [
                {name:"工地名称",key:"tanentName"},
                {name:"身份证号码",key:"studentNo"},
                {name:"工人姓名",key:"studentName"},
                {name:"考试成绩",key:"score"},
                {name:"考试时间",key:"showCreateTime"}
            ];
            enume.getData("/cmsapi/gd/homeworkItemList?homeworkId="+$scope.homeworkId,function(d){
                var tmp = d.split(',');
                for(var i=0;i<tmp.length;i++){
                    $scope.cols.push({name:tmp[i],key:tmp[i]});
                }
                $scope.load();
            })
        }

        $scope.getUrl = function(){
            return "/cmsapi/gd/homeworkWorkersItemList?cardNo="+$scope.cardNo+"&homeworkId="+$scope.homeworkId
                +"&beginTime="+enume.getCDate($scope.beginDate)+"&endTime="+enume.getCDate($scope.endTime);
        }

        $scope.pOption={
            size:10,
            index:1,
            SizeKey:"pageSize",
            IndexKey:"page"
        };

        $scope.analysis = function(data){
            var tmp = {data:[],totalCount:0,totalPage:-1};
            tmp.data = data.data.datas;
            tmp.totalCount = data.data.totalCount;
            return tmp;
        }

        function dealData(data){
            var tmp = data.content;
            if(tmp == ""){
                return data;
            }else{
                var arr = tmp.split(',');
                for(var i =0;i<arr.length;i++){
                    var key = arr[i].split(':')[0];
                    var val = arr[i].split(':')[1];
                    data[key] = val;
                }
            }
            return data;
        }

        $scope.cbForPaging = function(d){
            for(var i=0;i< d.length;i++){
                d[i] = dealData(d[i]);
            }
            $scope.list = d;
        }
    })