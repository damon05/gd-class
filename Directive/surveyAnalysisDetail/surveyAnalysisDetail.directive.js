/**
 * Created by wupeng5 on 2016/3/5.
 */


angular.module("app").directive("surveyAnalysisDetail",function(){
    return {
        templateUrl:"./Directive/surveyAnalysisDetail/surveyAnalysisDetail.html",
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
            $scope.items = null;
            $scope.excelData = {value:null};

            function dealDownFile(data,items){
                var tmp = {cellCount:3,rows:[
                    {
                        cells:[
                            {content:data.title,begin:1,end:3,fontSize:20,boldweight:1,border:1,bgcolor:0}
                        ]
                    }
                ]}
                for(var i =0;i<items.length;i++){
                    if(data.templateType == "wenjuan"){
                        tmp.rows.push({cells:[{content:"第"+items[i].sort+"题:"+items[i].name,begin:1,end:3,fontSize:12.5,boldweight:1,border:1,bgcolor:0}]});
                    }else{
                        tmp.rows.push({cells:[{content:"第"+items[i].sort+"题:"+items[i].name + " 分数:"+items[i].scores,begin:1,end:3,fontSize:12.5,boldweight:1,border:1,bgcolor:0}]});
                    }

                    tmp.rows.push(
                        {cells:[
                            {content:"选项",begin:1,end:1,fontSize:12.5,boldweight:1,border:1,bgcolor:0},
                            {content:"小计",begin:2,end:2,fontSize:12.5,boldweight:1,border:1,bgcolor:0},
                            {content:"比例",begin:3,end:3,fontSize:12.5,boldweight:1,border:1,bgcolor:0}
                        ]}
                    )

                    var x = items[i].children;
                    for(var k=0;k< x.length;k++){
                        tmp.rows.push({cells:[
                            {content:x[k].name + $scope.getBz(x[k].bz),begin:1,end:1,fontSize:12.5,boldweight:1,border:1,bgcolor:0},
                            {content:x[k].pcount,begin:2,end:2,fontSize:12.5,boldweight:1,border:1,bgcolor:0},
                            {content:x[k].percent+"%",begin:3,end:3,fontSize:12.5,boldweight:1,border:1,bgcolor:0}
                        ]});
                    }

                    tmp.rows.push(
                        {cells:[
                            {content:"本地有效填写人数",begin:1,end:1,fontSize:12.5,boldweight:1,border:1,bgcolor:0},
                            {content:items[i].total,begin:2,end:3,fontSize:12.5,boldweight:1,border:1,bgcolor:0}
                        ]}
                    )
                }
                console.log(tmp);
                return tmp;
            }

            document.querySelector("#downLoad").addEventListener("click",function(){
                document.querySelector("#data").value = jsCoreMethod.convertStringJson(dealDownFile($scope.data,$scope.items));
            },false);

            enume.getData("/cmsapi/template/statistics?code="+id,function(d){
                if(d.templateType == "kaoti"){
                    $scope.scoresShow = true;
                }else{
                    $scope.scoresShow = false;
                }
                $scope.data = d;
                $scope.items = dealData();
            })

            function getTotal(items){
                var t = 0;
                for(var i=0;i<items.length;i++){
                    t += items[i].pcount;
                }
                return t;
            }

            $scope.getBz =function(bz){
                if(bz){
                    return "(标准答案)";
                }else{
                    return "";
                }
            }

            function dealData(){
                var res = [];
                var d = $scope.data.data;
                for(var i=0;i< d.length;i++){
                    var tmp = d[i].tms;
                    for(var k=0;k<tmp.length;k++){
                        res.push({scores:tmp[k].scores,name:tmp[k].name,sort:tmp[k].sort,children:tmp[k].items,total:getTotal(tmp[k].items)});
                    }
                }
                return res;
            }
        }
    }
})