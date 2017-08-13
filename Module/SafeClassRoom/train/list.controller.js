'use strict';

angular.module('app')
    .controller('trainCtrl',function ($http,$scope,enume,$state) {

        $scope.homeWorks = enume.homeWorks;
        $scope.homeworkId = "0";

        $scope.addEditModal = false;
        $scope.list = [{name:"",__id:Math.ceil(Math.random()*10000000000000000)}];

        $scope.addTag = false;

        $scope.search = function(){
            $scope.load();
        }

        $scope.close = function(){
            $scope.addEditModal = false;
        }

        $scope.getUrl = function(){
            return "/cmsapi/gd/currentJudgeItem";
        }

        $scope.map = [
            {key:"tanentId",val:"工地编码",show:true},
            {key:"tanentName",val:"工地名称",show:true},
            {key:"itemNames",val:"评分内容",show:true}
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

        $scope.addItem = function(){
            $scope.list.push({name:"",__id:Math.ceil(Math.random()*10000000000000000)});
        }

        $scope.removeItem = function(item){
            $scope.list = $scope.list.removeItems([item]);
        }

        var selectItem = null;
        $scope.edit = function(item){
            $scope.addTag = true;
            $scope.list = [];
            selectItem = item;
            $scope.addEditModal = true;
            $scope.gd_name = item.tanentName;

            if(item.itemNames != ""){
                $scope.list = [];
                var tmp = item.itemNames.split(',');
                for(var i=0;i<tmp.length;i++){
                    $scope.list.push({name:tmp[i],__id:Math.ceil(Math.random()*10000000000000000)});
                }
            }
        }

        $scope.save = function(){
            var res = [];
            for(var i=0;i<$scope.list.length;i++){
                res.push($scope.list[i].name);
            }
            var url = "";
            if(!$scope.addTag){
                url = "/cmsapi/gd/updateCurrentJudgeItem?tanentId=&items="+res.join(',');
            }else{
                url = "/cmsapi/gd/updateCurrentJudgeItem?tanentId="+selectItem.tanentId+"&items="+res.join(',');
            }

            enume.postData(url,null,function(d){
                alert("保存成功!");
                $scope.load();
                $scope.addEditModal = false;
            })
        }

        $scope.actions = [
            {key:"edit",val:"设置评分项",action:$scope.edit}
        ];

        $scope.addPf = function(){
            $scope.list = [];
            $scope.addTag = false;
            $scope.addEditModal = true;
        }
    })