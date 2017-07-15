/**
 * Created by wupeng5 on 2016/3/5.
 */


angular.module("app").directive("createTmp",function(){
    return {
        templateUrl:"./Directive/createTmp/createTmp.html",
        restrict:"EA",
        scope:{
            "entity":"=",
        },
        link:function(){},
        controller:function($http,$scope,enume,$state,$rootScope){

            $scope.templateCates =  enume.templateCate;
            $scope.selectCate = "";

            $scope.templateTypes = enume.templateTypeForAdd;

            $scope.selectType = "wenjuan";

            //是否显示分数
            $scope.showScores = false;

            //页头标题
            $scope.t_title = "";

            //禁用默认标准答案
            $scope.isBzFlag = true;

            var holdSave = "";

            //映射问题类型
            $scope.getTiXing = function(cate){
                if(cate == "checkbox"){
                    return "多选题";
                } else if(cate == "radio"){
                    return "单选题";
                }else if(cate == "textbox"){
                    return "填空题";
                }else if(cate == "pingfen"){
                    return "评分提";
                } else{
                    return "未知体型";
                }
            }

            function getInfoByCode(){
                enume.getData("/cmsapi/template/queryByCode?code="+$scope.entity.code,function(d){
                    $scope.data = d;
                    $scope.showGY = true;
                    $scope.selectCate = d.templateCategory;
                    $scope.selectType = d.templateType;

                    if($scope.selectType == "kaoti"){
                        $scope.showScores = true;
                        $scope.isBzFlag = false;
                    }else{
                        $scope.showScores = false;
                        $scope.isBzFlag = true;
                    }
                })
            }

            $scope.showButton = true;

            $scope.data = null;
            if($scope.entity.tag == "edit"){
                $scope.t_title = "修改模板";
                getInfoByCode();
                $scope.showButton = true;
            }
            else if($scope.entity.tag == "detail"){
                $scope.t_title = "模板详情";
                getInfoByCode();
                $scope.showButton = false;
            }
            else{
                $scope.t_title = "创建模板";
                $scope.data = {
                    code:"",
                    templateCategory: $scope.selectCate,
                    templateType: $scope.selectType,
                    title: "",
                    random: "",
                    content: "",
                    "data": []
                };
                $scope.showButton = true;
            }

            //当前选中的章节
            var currentZj = null;

            //添加题目的开关
            var addFlag = false;

            //考题的开关
            var ktFlag = false;

            $scope.cls = "";
            $scope.cls1 = "red";
            $scope.cls2 = "red";
            $scope.cls3 = "";

            $scope.showGY = false;

            $scope.addTmByZj = function(item){

                if($scope.selectType == "kaoti"){
                    $scope.cls = "red";
                    $scope.cls3 = "";
                    ktFlag = true;
                }else{
                    $scope.cls = "red";
                    $scope.cls3 = "red";
                    ktFlag = false;
                }
                addFlag = true;
                currentZj = item;
            }

            $scope.deleteZjItem = function(item,data){
                if(window.confirm("是否要删除章节?")){
                    data.remove(item);
                    //数组重新排序
                    for(var i=0;i<data.length;i++){
                        data[i].sort = i+1;
                    }
                }
            }

            $scope.deleteItem = function(item,data){
                if(data.length == 1){
                    alert("请至少保留一个选项!");
                    return;
                }
                if(window.confirm("是否要删除题目, 如果删除题目将重新排序!")){
                    data.remove(item);
                    //数组重新排序
                    for(var i=0;i<data.length;i++){
                        data[i].sort = i+1;
                    }
                }
            }

            $scope.addGy = function(){
                if($scope.showGY){
                    alert("概要已经存在，请直接修改已有的概要。");
                    return;
                }
                $scope.cls1 = "";
                $scope.showGY = true;
                $scope.data.title = "设置概要标题调查问卷";
                $scope.data.content = "设置概要内容";
            }

            $scope.hideGy = function(){
                $scope.cls1 = "red";
                $scope.showGY = false;
                $scope.data.title = "";
                $scope.data.content = "";
            }

            $scope.addZj = function(){
                var sort = 0;
                if($scope.data.data.length == 0){
                    sort = 0;
                }else{
                    var items = jsCoreMethod.arraySortByField($scope.data.data,"sort",true,true);
                    sort = items[items.length-1].sort + 1;
                }
                var tmp = {title:"设置章节标题",tms:[],sort:sort};
                $scope.data.data.push(tmp);
            }

            $scope.changeType = function(x){
                if(window.confirm("切换模板类型会导致已填写的数据丢失,你是否确定切换?")){
                    $scope.data.data  = [];
                    $scope.data.templateType = x;
                    $scope.selectType = x;
                    $scope.showGY = false;
                    $scope.data.title = "设置概要标题调查问卷";
                    $scope.data.content = "设置概要内容";
                    $scope.cls1 = "red";
                    $scope.cls3 = "";
                    $scope.cls = "";
                }else{
                    if(x == "wenjuan"){
                        $scope.selectType = "kaoti";
                    }else{
                        $scope.selectType = "wenjuan";
                    }
                }
                if($scope.selectType == "kaoti"){
                    $scope.showScores = true;
                    $scope.isBzFlag = false;
                    ktFlag = true;
                }else{
                    $scope.showScores = false;
                    $scope.isBzFlag = true;
                    ktFlag = false;
                }
            }

            $scope.changeCate = function(x){
                $scope.data.templateCategory = x;
            }

            $scope.xzTm = function(){

            }


            function getPrevNextItem(item,data){
                var index = -1;
                for(var i=0;i<data.length;i++){
                    if(jsCoreMethod.equals(item,data[i])){
                        index = i;
                        break;
                    }
                }
                return {prev:data[index-1],next:data[index+1]};
            }
            //章节的上下移动
            function getZjItems(){
                return jsCoreMethod.arraySortByField($scope.data.data,"sort",true,true);
            }

            $scope.moveUp = function(item,data){
                if(item.sort == getZjItems()[0].sort){
                    alert("已经是第一个章节了!");
                    return;
                }

                var tmp1 = item.sort;
                var tmp2 = tmp1;
                item.sort -= 1;
                getPrevNextItem(item,data).prev.sort = tmp2;
                $scope.data.data = jsCoreMethod.arraySortByField($scope.data.data,"sort",true);
            }

            $scope.moveDown = function(item,data){
                var tmpRes = getZjItems();
                if(item.sort == tmpRes[tmpRes.length-1].sort){
                    alert("已经是最后一个章节了!");
                    return;
                }

                var tmp1 = item.sort;
                var tmp2 = tmp1;
                item.sort += 1;
                getPrevNextItem(item,data).next.sort = tmp2;

                $scope.data.data = jsCoreMethod.arraySortByField($scope.data.data,"sort",true);
            }

            //题目的上下移动
            function getTmItems(items){
                return jsCoreMethod.arraySortByField(items,"sort",true);
            }

            $scope.moveUpTm = function(item,data,p1){

                if(item.sort == getTmItems(data)[0].sort){
                    alert("已经是第一个题目了!");
                    return;
                }

                var tmp1 = item.sort;
                var tmp2 = tmp1;
                item.sort -= 1;
                getPrevNextItem(item,data).prev.sort = tmp2;
                //这里必须重新赋值, 否则不起作用
                p1.tms = jsCoreMethod.arraySortByField(data,"sort",true);
            }

            $scope.moveDownTm = function(item,data,p1){
                var tmpArr = getTmItems(data);
                if(item.sort == tmpArr[tmpArr.length-1].sort){
                    alert("已经是最后 一个题目了!");
                    return;
                }

                var tmp1 = item.sort;
                var tmp2 = tmp1;
                item.sort += 1;
                getPrevNextItem(item,data).next.sort = tmp2;
                //这里必须重新赋值, 否则不起作用
                p1.tms = jsCoreMethod.arraySortByField(data,"sort",true,true);
            }

            $scope.upTop = function(item,data,p1){

                var tmp1 = item.sort;
                var tmp2 = tmp1;
                var tmp3 = data[0].sort;
                var tmp4 = tmp3;

                item.sort = tmp4;
                data[0].sort = tmp2;

                p1.tms = jsCoreMethod.arraySortByField(data,"sort",true,true);
            }

            $scope.upLast = function(item,data,p1){
                var tmp1 = item.sort;
                var tmp2 = tmp1;
                var tmp3 = data[data.length-1].sort;
                var tmp4 = tmp3;

                item.sort = tmp4;
                data[data.length-1].sort = tmp2;

                p1.tms = jsCoreMethod.arraySortByField(data,"sort",true,true);
            }

            $scope.addDA = function(item,items,cate){

                var tmp = jsCoreMethod.arraySortByField(items,"sort",true);

                var count = tmp[tmp.length-1].sort + 1;
                if(cate == "textbox"){
                    items.push({name:"请输入参考答案",title:"请输入答案内容",bz:false,sort:count});
                }
                else if(cate == "pingfen"){
                    items.push({name:"请输入答案内容",number:0,bz:false,sort:count});
                }else{
                    items.push({name:"请输入答案内容",bz:false,sort:count});
                }

            }

            function getDaAnArray(items){
                return jsCoreMethod.arraySortByField(items,"sort",true);
            }

            $scope.upTopDA = function(item,items,p2){
                var currentSort = item.sort;
                if(currentSort == getDaAnArray(items)[0].sort){
                    alert("已经是第一个答案了!");
                    return;
                }
                var prevSort = currentSort - 1;

                getPrevNextItem(item,items).prev.sort = currentSort;
                item.sort = prevSort;

                var items = jsCoreMethod.arraySortByField(items,"sort",true,true);
                //重新赋值到数据源里面去
                p2.items = items;

            }

            $scope.upLastDA = function(item,items,p2){
                var currentSort = item.sort;
                var tmp = getDaAnArray(items);
                if(currentSort == tmp[tmp.length-1].sort){
                    alert("已经是最后一个答案了!");
                    return;
                }
                var nextSort = currentSort + 1;

                getPrevNextItem(item,items).next.sort = currentSort;
                item.sort = nextSort;

                var items = jsCoreMethod.arraySortByField(items,"sort",true,true);
                //重新赋值到数据源里面去
                p2.items = items;
            }

            function addTiMu(cate){
                if(addFlag == false){
                    alert("您还没有选择章节!");
                    return;
                }
                //还没有添加题目
                var tmp = null;
                if(!currentZj.tms ||currentZj.tms.length == 0){
                    if(cate == "textbox"){
                        tmp = {cate:cate,bida:false,wtjtt:false,scores:0,name:"请输入题目标题",sort:1,items:[
                            {name:"请输入参考答案",title:"请输入答案内容",bz:false,sort:1}
                        ]};

                    } else if(cate == "pingfen"){
                        tmp = {cate:cate,bida:false,wtjtt:false,scores:0,name:"请输入题目标题",sort:1,items:[
                            {name:"请输入答案内容",number:0,bz:false,sort:1}
                        ]};
                    }else{
                        tmp = {cate:cate,bida:false,wtjtt:false,scores:0,name:"请输入题目标题",sort:1,items:[
                            {name:"请输入答案内容",bz:false,sort:1}
                        ]};
                    }
                }else{
                    var res = jsCoreMethod.arraySortByField(currentZj.tms,"sort",true);
                    var lastCount = res[res.length-1].sort + 1;

                    if(cate == "textbox"){
                        tmp = {cate:cate,bida:false,wtjtt:false,scores:0,name:"请输入题目标题",sort:lastCount,items:[
                            {name:"请输入参考答案",title:"请输入答案内容",bz:false,sort:1}
                        ]};
                    }
                    else if(cate == "pingfen"){
                        tmp = {cate:cate,bida:false,wtjtt:false,scores:0,name:"请输入题目标题",sort:lastCount,items:[
                            {name:"请输入答案内容",number:0,bz:false,sort:1}
                        ]};
                    }else{
                        tmp = {cate:cate,bida:false,wtjtt:false,scores:0,name:"请输入题目标题",sort:lastCount,items:[
                            {name:"请输入答案内容",bz:false,sort:1}
                        ]};
                    }
                }
                currentZj.tms.push(tmp);
                addFlag = false;
                ktFlag = false;

                $scope.cls = "";
                $scope.cls3 = "";
            }

            $scope.addDanx = function(){
                if(addFlag == false){
                    return;
                }
                addTiMu("radio");
            }

            $scope.addDuox = function(){
                if(addFlag == false){
                    return;
                }
                addTiMu("checkbox");
            }

            $scope.addPf = function(){
                if(addFlag == false || ktFlag){
                    return;
                }
                addTiMu("pingfen");
            }

            $scope.addTk = function(){
                if(addFlag == false || ktFlag){
                    return;
                }
                addTiMu("textbox");
            }

            $scope.preview = function(){
                var url = "";
                if($scope.entity.tag == "edit"){
                    url = "/cmsapi/template/update";
                }else{
                    url = "/cmsapi/template/add";
                }

                if($scope.selectCate == ""){
                    alert("请选择模板类型");
                    return;
                }

                enume.postData(url,$scope.data,function(d){
                    alert("保存成功");
                    if($rootScope.userFlag == "userSafe"){
                        $state.go("safeRoom.templateList");
                    }else{
                        $state.go("roomManage.templateList");
                    }
                    window.open("out.html?code="+ d,"_blank","height=800,width=500");
                })
            }

            $scope.doHoldSubmit = function(){
                var url = "";
                if($scope.entity.tag == "edit"){
                    url = "/cmsapi/template/update";
                }else{
                    if(holdSave == ""){
                        url = "/cmsapi/template/add";
                    }
                    else{
                        url = "/cmsapi/template/update";
                        $scope.data.code = holdSave;
                    }
                }

                if($scope.selectCate == ""){
                    alert("请选择模板类型");
                    return;
                }

                enume.postData(url,$scope.data,function(d){
                    holdSave = d;
                    alert("保存成功");
                })
            }

            $scope.goBack = function(){
                if($rootScope.userFlag == "userSafe"){
                    $state.go("safeRoom.templateList");
                }else{
                    $state.go("roomManage.templateList");
                }
            }
        }
    }
})