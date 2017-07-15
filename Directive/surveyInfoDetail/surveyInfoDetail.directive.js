/**
 * Created by wupeng5 on 2016/3/5.
 */


angular.module("app").directive("surveyInfoDetail",function(){
    return {
        templateUrl:"./Directive/surveyInfoDetail/surveyInfoDetail.html",
        restrict:"EA",
        scope:{
            "entity":"="
        },
        link:function(){},
        controller:function($http,$scope,enume,$state){

            var id = $scope.entity.id;

            if(!id){
                alert("参数错误!");
                return;
            }

            $scope.data = null;
            $scope.scoresShow = false;
            $scope.details = [];
            $scope.wentis = [];
            $scope.colSpan = [];
            $scope.wtTitles = [];

            function dealDownFile(data,colSpan,wentis,details,wtTitles){
                var tmp = {cellCount:wentis.length,rows:[]};

                //标题
                var row1 = {cells:[]};
                var fc = 1;
                var lc = 0;
                for(var i=0;i<colSpan.length;i++){
                    lc += colSpan[i].colspan;
                    row1.cells.push({content:colSpan[i].name,begin:fc,end:lc,fontSize:12.5,boldweight:1,border:1,bgcolor:0});
                    fc = lc + 1;
                }
                tmp.rows.push(row1);

                //问题title
                var row2 = {cells:[]};
                for(var i=0;i<wtTitles.length;i++){
                    row2.cells.push({content:"第"+wtTitles[i].sort+"题",begin:(i+1),end:(i+1),fontSize:12.5,boldweight:1,border:1,bgcolor:0});
                }
                tmp.rows.push(row2);

                //分数
                if(data.templateType != "wenjuan"){
                    var row3 = {cells:[]};
                    for(var i=0;i<wentis.length;i++){
                        row3.cells.push({content:"答案("+wentis[i].bz+")/分数"+wentis[i].scores,begin:(i+1),end:(i+1),fontSize:12.5,boldweight:1,border:1,bgcolor:0});
                    }
                    tmp.rows.push(row3);
                }

                //详情
                for(var i=0;i<details.length;i++){
                    var row4 = {cells:[]};
                    var children = details[i].children;
                    for(var k=0;k<children.length;k++){
                        row4.cells.push({content:children[k].name,begin:(k+1),end:(k+1),fontSize:12.5,boldweight:1,border:1,bgcolor:0});
                    }
                    tmp.rows.push(row4);
                }
                return tmp;
            }

            document.querySelector("#downLoad").addEventListener("click",function(){
                document.querySelector("#data").value = jsCoreMethod.convertStringJson(dealDownFile($scope.data,$scope.colSpan,$scope.wentis,$scope.details,$scope.wtTitles));
            },false);

            function getHeadInfo(data){
                var d = data.data;

                var colSpans = [];
                var wtTitles = [];
                for(var i=0;i< d.length;i++){

                    var tmp = {name:d[i].title,colspan:0};

                    var count = 0;

                    var tms = d[i].tms;
                    for(var k=0;k<tms.length;k++){
                        if(tms[k].cate == "textbox"){
                            var items = tms[k].items;
                            for(var u=0;u<items.length;u++){
                                count++;
                                tmp.colspan++;
                                wtTitles.push({sort:count,name:items[u].name});
                            }
                        }else{
                            count++;
                            wtTitles.push({sort:count,name:tms[k].name});
                            tmp.colspan++;
                        }
                    }
                    colSpans.push(tmp);
                }
                return {cols:colSpans,wtTitles:wtTitles};
            }
            function getAllWentis(data){

                var tmpRes = {wentis:[],res:[]};

                for(var i=0;i< data.length;i++){
                    var tms = data[i].tms;
                    for(var k=0;k<tms.length;k++){
                        if(tms[k].cate == "textbox"){
                            var items = tms[k].items;
                            for(var u=0;u<items.length;u++){
                                tmpRes.wentis.push(items[u]);
                            }
                        }else{
                            tmpRes.wentis.push(tms[k]);
                        }
                    }
                }

                var len = tmpRes.wentis[0].value.split('-').length;
                //scores
                for(var i=0;i<len;i++){
                    var tmp = {children:[]};
                    for(var k=0;k<tmpRes.wentis.length;k++){
                        tmp.children.push({name:tmpRes.wentis[k].value.split('-')[i]});
                    }
                    tmpRes.res.push(tmp);
                }

                return tmpRes;
            }
            enume.getData("/cmsapi/template/resultInfo?code="+id,function(d){
                if(d.templateType == "kaoti"){
                    $scope.scoresShow = true;
                }else{
                    $scope.scoresShow = false;
                }

                $scope.data = d;
                var tmp = getHeadInfo($scope.data);
                $scope.colSpan = tmp.cols;
                $scope.wtTitles = tmp.wtTitles;
                var res = getAllWentis(d.data);

                $scope.details = res.res;
                $scope.wentis = res.wentis;
            })
        }
    }
})