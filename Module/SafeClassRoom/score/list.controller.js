'use strict';

angular.module('app')
    .controller('scoreCtrl',function ($http,$scope,enume,$state) {
        $scope.homeWorks = enume.homeWorks;
        $scope.homeworkId = "0";
        $scope.beginTime = "";
        $scope.endTime = "";
        $scope.cardNo = "";
        $scope.addEditModal = false;
        $scope.list = [];
        //$scope.scores = [];

        $scope.selectData = [
            {name:"请选择",code:"0"},
            {name:"不及格",code:"70"},
            {name:"及格",code:"80"},
            {name:"良好",code:"90"},
            {name:"优秀",code:"100"}
        ];

        $scope.search = function(){
            $scope.load();
        }

        $scope.export = function(){
            var url = "/cmsapi/gd/homeworkWorkersItemExport?cardNo="+$scope.cardNo+"&homeworkId="+$scope.homeworkId
                +"&beginTime="+enume.getCDate($scope.beginTime)+"&endTime="+enume.getCDate($scope.endTime);
            window.open(url);
        }

        $scope.getUrl = function(){
            return "/cmsapi/gd/homeworkWorkersItemList?cardNo="+$scope.cardNo+"&homeworkId="+$scope.homeworkId
                +"&beginTime="+enume.getCDate($scope.beginTime)+"&endTime="+enume.getCDate($scope.endTime);
        }

        function convertCreateTime(item){
            return enume.getCDate(item.createTime);
        }

        $scope.map = [
            {key:"tanentName",val:"工地名称",show:true},
            {key:"studentNo",val:"身份证",show:true},
            {key:"studentName",val:"姓名",show:true},
            {key:"score",val:"考试成绩",show:true},
            {key:"createTime",val:"考试时间",show:true,action:{key:"convert",convert:convertCreateTime}},
            {key:"content",val:"评分结果",show:true}
        ];

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

        //"安全意识:95,安全意识:95,安全意识:95,安全意识:95"
        $scope.dealItem = function(str){
            if(str == ""){
                return [];
            }
            var res = [];
            var scores =[];
            var arr = str.split(',');
            for(var i=0;i<arr.length;i++){
                res.push({name:arr[i].split(':')[0],score:arr[i].split(':')[1]});
            }
            return {res:res,scores:scores};
        }

        var selectedItem = null;
        $scope.edit = function(item){
            var tmp = $scope.dealItem(item.content);
            $scope.addEditModal = true;
            $scope.bh = item.id;
            $scope.xm = item.studentName;
            $scope.fs = item.score;
            $scope.list = tmp.res;
            //$scope.scores = tmp.scores;
            selectedItem = item;
        }

        $scope.save = function(){
            var tmp = [];
            for(var i=0;i<$scope.list.length;i++){
                tmp.push($scope.list[i].name + ":" + $scope.list[i].score);
            }
            enume.postData("/cmsapi/gd/updateHomeworkWorkersItem?gdSignId="+selectedItem.signId+"&cardNo="+selectedItem.studentNo+"&itemJson="+tmp.join(','),null,function(){
                alert("保存成功!");
                $scope.addEditModal = false;
                $scope.load();
            })
        }

        $scope.close = function(){
            $scope.addEditModal = false;
        }

        $scope.actions = [
            {key:"edit",val:"评分",action:$scope.edit}
        ];
    })