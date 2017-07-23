(function(angular){
    'use strict';
    angular.module("pagingModule",[]).directive("pagingModule",function(){
        return {
            template:
            "共<span class='pagingPageNum' ng-bind='totalProCount'></span>条"+
            "<input type='button' class='pagingBtn' value='上一页' ng-click='prev()'/>"+
            "<input type='button' class='pagingBtn' value='下一页' ng-click='next()' />"+
            "当前第<span class='pagingPageNum' ng-bind='currentIndex'></span>/<span class='pagingPageNum' ng-bind='allPages'></span>页"+
            "到<input type='text' style='width:20px' class='mb20' ng-model='enterIndex'/>页"+
            "<input type='button' value='确定' class='pagingBtn' ng-click='doEnterSearch()'/>",
            restrict:"EA",
            scope:{
                "callbackFn":"=",
                "getUrl":"=",
                "doLoad":'=',
                "analysis":"=",
                "pagingOption":"="
            },
            link:function(){},
            controller:function($scope,$http,$state){
                if(!$scope.callbackFn || !$scope.getUrl || typeof $scope.callbackFn != "function" || typeof $scope.getUrl != "function"){
                    alert("回调函数和获取URL地址必须配置为函数!");
                    return;
                }

                $scope.pagingOptionData = $scope.pagingOption;

                $scope.map = null;

                var index = $scope.pagingOptionData.index;
                var size = $scope.pagingOptionData.size;

                $scope.totalProCount = 0;
                $scope.allPages = 0;
                $scope.currentIndex = 0;
                $scope.enterIndex = "";

                function dealUrl(){

                    var _url = $scope.getUrl();
                    if(_url.indexOf('?') == -1){
                        return _url + "?"+$scope.pagingOptionData.IndexKey+"="+index+"&"+$scope.pagingOptionData.SizeKey+"="+size+"&ran="+Math.random();
                    }else{
                        return _url + "&"+$scope.pagingOptionData.IndexKey+"="+index+"&"+$scope.pagingOptionData.SizeKey+"="+size+"&ran="+Math.random();
                    }
                }

                function getData(){
                    $http.get(dealUrl()).success(function(d){
                        if(d.status == "701"){
                            $state.go('login');
                        }else if(d.status == "403"){
                            alert(d.msg);
                            return;
                        }
                        if($scope.analysis){
                            d = $scope.analysis(d);
                        }

                        if(!d.data){
                            console.log("datasource is null");
                            return;
                        }

                        for(var i=0;i< d.data.length;i++){
                            d.data[i].ck = false;
                        }

                        if(d.totalPage == "-1"){
                            if(parseInt(d.totalCount)%size == 0){
                                $scope.allPages = parseInt(d.totalCount)/size;
                            }else{
                                $scope.allPages = parseInt(parseInt(d.totalCount)/size) + 1;
                            }
                        }else{
                            $scope.allPages = d.totalPage;
                        }

                        $scope.totalProCount = d.totalCount;
                        $scope.currentIndex = index;

                        $scope.callbackFn(d.data);
                    })
                }

                $scope.$on("doSearch",function(event,data){
                    index = 1;
                    getData();
                })

                $scope.doEnterSearch = function(){
                    var val  = parseInt($scope.enterIndex);
                    if(isNaN(val) || val > parseInt($scope.allPages) || val <1 ){
                        alert("请输入小于总页数的正整数!");
                        return;
                    }
                    index = val;
                    getData();
                }

                $scope.prev = function(){
                    $scope.enterIndex = "";
                    if(index == $scope.pagingOptionData.index){
                        return;
                    }
                    index--;
                    getData();
                }

                $scope.next = function(){
                    $scope.enterIndex = "";
                    if(index == parseInt($scope.allPages)){
                        return;
                    }
                    index++;
                    getData();
                }

                $scope.doLoad = function () {
                    getData();
                };
                getData();
            }
        }
    })
})(angular);

(function(angular){
    'use strict';
    angular.module("repeatFinish",[]).directive('repeatFinishCb',function(){
        return {
            restrict:"A",
            link: function(scope,element,attr){
                //console.log(scope.$index);
                if(scope.$last == true){
                    scope.$emit('renderCompleted');
                }
            }
        }
    })
})(angular);

(function(angular){
    'use strict';

    angular.module("tableKillModule",['pagingModule','repeatFinish']).directive("tableKill",function($timeout){
        return {
            templateUrl:"/Directive/tableList/temp.html",
            restrict:"EA",
            scope:{
                "getUrl":"=",
                "loadData": '=',
                "map":"=",
                "actions":"=",
                "renderCompletedCb":"=",
                "analysis":"=",
                "pagingOption":"=",
                "showCk":"@",
                "selectCkCb":"="
            },
            controller:function($scope,$http){

                var naviTool = {
                    mapCols:[],
                    allCols:[],
                    cols:[],
                    isReady:false,
                    errorCols:[],
                    readyInit:function(data,map){
                        if(!data || !map || data instanceof Array == false || map instanceof Array == false ){
                            this.isReady = false;
                        }else{
                            var _tmp = this.checkMap(data,map);
                            if(_tmp){
                                this.isReady = true;
                            }else{
                                this.isReady = false;
                            }
                        }
                    },
                    dealData:function(data){
                        for(var i=0;i<data.length;i++){
                            if(!data[i].show){
                                data[i].show = false;
                            }
                            if(!data[i].action){
                                data[i].action = null;
                            }
                        }
                    },
                    getCols:function(data,map){
                        this.cols.length = 0;
                        this.readyInit(data,map);
                        if(this.isReady == false){
                            if(!data || data.length ==0){
                                console.log("数据源为空,请检查数据源!");
                            }else{
                                console.log("数据源和map映射不匹配!",this.errorCols.join(','));
                            }
                        }
                        var res = [];
                        for(var i=0;i<this.cols.length;i++){
                            var tmp = this.getColsByKey(this.cols[i],map);
                            if(tmp){
                                res.push(tmp);
                            }
                        }
                        this.cols = res;
                        return this.cols;
                    },
                    getColsByKey:function(name,map){
                        var res = null;
                        for(var i=0;i<map.length;i++){
                            if(map[i].show){
                                if(map[i].key == name){
                                    res = map[i];
                                    break;
                                }
                            }
                        }
                        return res;
                    },
                    checkMap:function(data,map){
                        var count = 0;
                        this.errorCols.length = 0;
                        this.mapCols.length = 0;
                        this.allCols.length = 0;
                        this.cols.length = 0;
                        this.getMapCols(map);
                        this.getAllCols(data);
                        for(var i =0;i<this.mapCols.length;i++){
                            var bl = false;
                            for(var k=0;k<this.allCols.length;k++){
                                if(this.mapCols[i] == this.allCols[k]){
                                    bl = true;
                                    break;
                                }
                            }
                            if(bl){
                                count++;
                                this.cols.push(this.mapCols[i]);
                            }else{
                                this.errorCols.push(this.mapCols[i]);
                            }
                        }
                        if(count == this.mapCols.length){
                            return true
                        }
                        return false;
                    },
                    getMapCols:function(map){
                        if(!map || map instanceof Array == false ){
                            return null;
                        }
                        for(var i=0;i<map.length;i++){
                            this.mapCols.push(map[i].key);
                        }
                    },
                    getAllCols:function(data){
                        if(!data || data instanceof Array == false ){
                            return null;
                        }
                        var tmp = data[0];
                        for(var i in tmp){
                            this.allCols.push(i);
                        }
                    }
                };

                var selectTool = {
                    getSelectedItems : function(data){
                        var res = [];
                        for(var i=0;i<data.length;i++){
                            if(data[i].ck){
                                res.push(data[i]);
                            }
                        }
                        return res;
                    },
                    selectAll : function(data,tag){
                        for(var i=0;i<data.length;i++){
                            data[i].ck = tag;
                        }
                    },
                    selectOne : function(data,cb){
                        var len = data.length;
                        var slen = this.getSelectedItems(data).length;

                        var tagAll = false;
                        if(len != slen){
                            tagAll = false;
                        }else{
                            tagAll = true;
                        }
                        cb(tagAll);
                    },
                    getIndex:function(item,items){
                        var _index = -1;
                        for(var i=0;i<items.length;i++){
                            if(jsCoreMethod.equals(item,items[i])){
                                _index = i;
                                break;
                            }
                        }
                        return _index;
                    }
                };

                $scope.$on("renderCompleted",function(){
                    if($scope.renderCompletedCb){
                        $scope.renderCompletedCb();
                    }
                });

                $scope.showCk = false;

                $scope.readyRenderData = false;

                $scope.showActionButton = false;

                $scope.cols = [];

                $scope.items = [];

                $scope.allCkStatus = false;

                $scope.selectAll = function(){
                    selectTool.selectAll($scope.items,$scope.allCkStatus);
                    $scope.selectCkCb(selectTool.getSelectedItems($scope.items),null);
                }

                $scope.selectOne = function(item,items){
                    item.ck = !item.ck;
                    if(!$scope.showCk || $scope.selectCkCb == undefined){
                        return;
                    }
                    selectTool.selectOne(items,function(tag){
                        $scope.allCkStatus = tag;
                    })

                    $scope.selectCkCb(selectTool.getSelectedItems($scope.items),selectTool.getIndex(item,items));
                }



                $scope.getUrlForPaging = $scope.getUrl;
                //$scope.doLoad = $scope.loadData;

                function checkObjIsNull(obj){
                    var res = [];
                    for(var i in obj){
                        res.push(i);
                    }
                    return res;
                }

                $scope.cbForPaging = function(d,option){
                    $scope.allCkStatus = false;
                    var tmp = checkObjIsNull(d);
                    if(d.length == 0 || tmp.length == 0){
                       if($scope.cols.length == 0){
                           $scope.readyRenderData = false;
                       }else{
                           $scope.readyRenderData = true;
                       }
                    }else{
                        $scope.readyRenderData = true;
                    }

                    $scope.items = d;
                    //if(option){
                    //    $scope.map = option.map;
                    //    $scope.actions = option.actions;
                    //}
                    if($scope.cols.length == 0){
                        $scope.cols = naviTool.getCols($scope.items,$scope.map);
                    }
                };

                $scope.actionsForList = $scope.actions;

                $scope.analysisData = $scope.analysis;
                $scope.pagingOptionData = $scope.pagingOption;

                if($scope.actions && $scope.actions.length != 0){
                    $scope.showActionButton = true;
                }
            }
        }
    })
})(angular);
