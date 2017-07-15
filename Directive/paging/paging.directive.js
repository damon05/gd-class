/**
 * Created by wupeng5 on 2016/3/5.
 */


angular.module("app").directive("paging",function(){
    return {
        templateUrl:"./Directive/paging/paging.html",
        restrict:"EA",
        scope:{
            "callbackFn":"=",
            "getUrl":"="
        },
        link:function(){},
        controller:function($scope,$http,$rootScope){

            var index = 1;
            var size = 10;

            $scope.totalProCount = 0;
            $scope.allPages = 0;
            $scope.currentIndex = 0;
            $scope.enterIndex = "1";

            function dealUrl(){
                if(!$scope.getUrl()){
                    return "";
                }
                return $scope.getUrl() + "&pageIndex="+index+"&pageSize="+size+"&ran="+Math.random();
            }

            function getData(){
                var url = dealUrl();
                if(url == ""){
                    return;
                }
                $http.get(url).success(function(d){

                    if(d.status.code == "1"){
                        var tmp = d.data.datas;

                        if(!tmp || tmp.length == 0){
                            $scope.callbackFn([]);
                        }else{
                            for(var i=0;i<tmp.length;i++){
                                tmp[i].ck = false;
                            }

                            $scope.callbackFn(tmp);
                        }
                        $scope.allPages = d.data.totalIndex;
                        $scope.totalProCount = d.data.totalCount;
                        $scope.currentIndex = index;
                    }
                    else{
                        alert(d.status.message);
                    }
                })
            }

            $scope.$on("searchByFilter",function(event,data){
                index = 1;

                getData();

            })

            $scope.enterValueSearch = function(){
                var val  = parseInt($scope.enterIndex);
                if(isNaN(val) || val > parseInt($scope.allPages) || val <1 ){
                    alert("请输入小于总页数的正整数!");
                    return;
                }
                index = val;

                getData();

            }

            $scope.prev = function(){
                if(index == 1){
                    return;
                }
                index--;

                getData();

            }

            $scope.next = function(){
                if(index == parseInt($scope.allPages)){
                    return;
                }
                index++;

                getData();

            }


            getData();

        }
    }
})