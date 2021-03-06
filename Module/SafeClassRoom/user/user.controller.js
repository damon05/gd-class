angular.module('app')
    .controller('userManagementCtrl', function ($http,$scope,$state,enume) {

        $scope.userTypes =  enume.uRylxs;
        $scope.userTypeNum = "";
        $scope.uName = "";

        $scope.teachers = enume.uGws;
        $scope.teacherNum = "";

        $scope.beginDate = "";
        $scope.endDate = "";

        $scope.userList = [];

        $scope.userListSearch = function(){
            $scope.$broadcast("searchByFilter");
        }

        $scope.goAdd = function(){
            $state.go("safeRoom.createUser",{entity:{tag:"add"}});
        }

        $scope.getUrl = function(){
            return "/cmsapi/user/query?studentId=&name="+$scope.uName+"&begin="+$scope.beginDate + "&end="+$scope.endDate+"&type="+$scope.userTypeNum+"&post="+$scope.teacherNum;
        }

        $scope.directiveCallBack = function(valueFromDirective){
            $scope.userList = valueFromDirective;
        }

        $scope.editUser = function(item){
            $state.go("safeRoom.createUser",{entity:{tag:"edit",studentId:item.studentId}});
        }

        $scope.deleteUser = function(item){
            $http.get("/cmsapi/user/delete/"+item.id).success(function(d){
                if(d.status.code == "1"){
                    $scope.userList = $scope.userList.deleteByKey("id",item.id);
                }else{
                    alert(d.status.message);
                }
            })
        }

        $scope.goDetail = function(item){
            $state.go("safeRoom.createUser",{entity:{tag:"detail",studentId:item.studentId}});
        }

    })

    .controller('classManagementCtrl',function($http,$scope,$state,enume){

        $scope.xx = enume.xx;
        $scope.xn = [{name:"全部",code:"0"}];
        $scope.nj = [{name:"全部",code:""}];
        $scope.bj = [{name:"全部",code:""}];
        $scope.xxNum = "";
        $scope.xnNum = "0";
        $scope.njNum = "";
        $scope.bjNum = "";

        $scope.bjList = [];
        $scope.errorXsl = false;

        $scope.downLink = "";
        $scope.btnCls = "btnGray";
        $scope.isDisabled = true;

        $scope.NIANJI = enume.NIANJI;
        $scope.njbh = "";

        function downFile(){
            $scope.downLink = "";
            $scope.btnCls = "btnGray";
            $scope.isDisabled = true;
            enume.getData("/cmsapi/tclass/download?xxhb="+$scope.xxNum+"&njbh="+$scope.njNum+"&bjbh="+$scope.bjNum+"&xn="+$scope.xnNum,function(d){
                $scope.btnCls = "btnGreen";
                $scope.downLink = "/file/"+d;
                $scope.isDisabled = false;
            })
        }

        downFile();

        $scope.changeXx = function(){
            if($scope.xxNum == ""){
                $scope.xn = [{name:"全部",code:"0"}];
                $scope.nj = [{name:"全部",code:""}];
                $scope.bj = [{name:"全部",code:""}];
            }else{
                enume.getXnByXx($scope.xxNum,function(d){
                    $scope.xn = [{name:"全部",code:"0"}];
                    d = d.datas;
                    for(var i=0;i< d.length;i++){
                        $scope.xn.push({name:d[i],code:d[i]});
                    }
                });
            }
            $scope.xnNum = "0";
            $scope.njNum = "";
            $scope.bjNum = "";
        }

        $scope.changeXn = function(){
            if($scope.xnNum == "0"){
                $scope.nj = [{name:"全部",code:""}];
                $scope.bj = [{name:"全部",code:""}];
            }else{
                enume.getNjByXn($scope.xxNum,$scope.xnNum,function(d){
                    $scope.nj = [{name:"全部",code:""}];
                    for(var i=0;i< d.length;i++){
                        $scope.nj.push({name:d[i].njmc,code:d[i].njbh});
                    }
                });
            }
            $scope.njNum = "";
            $scope.bjNum = "";
        }

        $scope.changeNj = function(){
            if($scope.njNum == ""){
                $scope.bj = [{name:"全部",code:""}];
            }else{
                enume.getBjByXnAndNjBh($scope.xxNum,$scope.xnNum,$scope.njNum,function(d){
                    $scope.bj = [{name:"全部",code:""}];
                    for(var i=0;i< d.length;i++){
                        $scope.bj.push({name:d[i].bjmc,code:d[i].bjbh});
                    }
                });
            }
            $scope.bjNum = "";
        }

        $scope.getUrl = function(){
            return "/cmsapi/tclass/query?xxhb="+$scope.xxNum+"&njbh="+$scope.njNum+"&bjbh="+$scope.bjNum+"&xn="+$scope.xnNum;
        }

        $scope.del = function(item){
            if(window.confirm("确认删除班级吗?如果删除班级, 班级所有学生都会被删除!")){
                enume.getData("/cmsapi/tclass/delete?id="+item.lineid,function(){
                    $scope.bjList = $scope.bjList.deleteByKey("lineid",item.lineid);
                })
            }
        }

        $scope.directiveCallBack = function(valueFromDirective){
            $scope.bjList = valueFromDirective;
        }

        var fileContent = "";
        jsCoreMethod.fileReader("fileLoad",function(d){
            fileContent = d;
        },"excel")

        $scope.uploadFile = function(){

            if($scope.njbh == ""){
                alert("请选择一个年级!");
                return;
            }

            if(!fileContent){
                alert("请选择excel文件上传!");
                return;
            }
            $http({
                method:"POST",
                url:"/cmsapi/tclass/upload?njbh="+$scope.njbh,
                data:{data:fileContent}
            }).success(function(d){
                if(d.status.code == "1"){
                    $scope.$broadcast("searchByFilter");
                    $scope.errorXsl = false;
                    alert("excel上传成功!");
                }else if(d.status.code == "3"){
                    $scope.errorXsl = true;
                    $scope.errorUrl = d.data;
                    alert("excel文件里有错误，请下载查看详情!");
                }else{
                    alert(d.status.message);
                }
            })
        }

        $scope.seachBj = function(){
            $scope.$broadcast("searchByFilter");
        }

        $scope.updateClass= function(){
            enume.postData("/cmsapi/tclass/updateClassNj",null,function(d){
                $scope.seachBj();
            })
        }
    })

    .controller('createUserCtrl',function($http,$scope,$state,enume,$stateParams){

        $scope.useSex = enume.userSex;
        $scope.sex = "";
        $scope.nationalityNum = "";
        $scope.placeNum = "";
        $scope.idType = enume.idType;
        $scope.idTypeNum = "";
        $scope.maritalStatus = enume.maritalStatus;
        $scope.maritalStatusNum = "";
        $scope.macao = enume.macao;
        $scope.macaoNum = "";
        $scope.nationNum = "";
        $scope.provinces = enume.provinces;
        $scope.provincesNum = "";
        $scope.citys = [];
        $scope.citysNum = "";
        $scope.downs = [];
        $scope.downsNum = "";

        $scope.uRylxs = enume.uRylxs;
        $scope.urylxNum = "";
        $scope.uGws = enume.uGws;
        $scope.ugwNum = "";

        $scope.utitle = "";
        $scope.showImg = false;

        $scope.zhanghao = "";
        $scope.mima = "";

        $scope.showButton = true;

        function getUserByStuId(){
            enume.getData("/cmsapi/user/queryById?studentId="+$stateParams.entity.studentId,function(tmp){
                $scope.sex = tmp.sex;
                $scope.nationalityNum = tmp.nationalityNum;
                $scope.placeNum = tmp.placeNum;
                $scope.idTypeNum = tmp.idTypeNum;
                $scope.maritalStatusNum = tmp.maritalStatusNum;
                $scope.macaoNum = tmp.macaoNum;
                $scope.nationNum = tmp.nationNum;
                $scope.provincesNum = tmp.provincesNum;
                $scope.citysNum = tmp.citysNum;
                $scope.downsNum = tmp.downsNum;
                $scope.gh = tmp.gh;
                $scope.cym = tmp.cym;
                $scope.xm = tmp.xm;
                $scope.ywxm = tmp.ywxm;
                $scope.xmpy = tmp.xmpy;
                $scope.zjhm = tmp.zjhm;
                $scope.csrq = new Date(tmp.csrq);
                $scope.urylxNum = tmp.urylxNum;
                $scope.ugwNum = tmp.ugwNum;
                $scope.zhanghao = tmp.account;
                $scope.mima = tmp.password;
                $scope.email = tmp.email;

                document.querySelector("#img1").setAttribute("src",tmp.zp);
            })
        }

        if($stateParams.entity.tag == "edit"){
            getUserByStuId();
            $scope.showImg = true;
            $scope.utitle = "人员修改";
            $scope.showButton = true;
        }
        else if($stateParams.entity.tag == "detail"){
            getUserByStuId();
            $scope.showImg = true;
            $scope.utitle = "人员详情";
            $scope.showButton = false;
        }
        else{
            $scope.showImg = false;
            $scope.utitle = "人员录入";
            $scope.showButton = true;
        }

        $scope.selectProvinces = function(){
            enume.getData("/cmsapi/user/queryCitys?province="+$scope.provincesNum,function(tmp){
                $scope.citys = tmp;
            })
        }

        $scope.selectCitys = function(){
            enume.getData("/cmsapi/user/queryAreas?city="+$scope.citysNum,function(tmp){
                $scope.downs = tmp;
            })
        }

        var fileContent = "";
        jsCoreMethod.fileUploadByFormAjax("fileLoad",function(d){
            fileContent = "/file"+d;
            $scope.showImg = true;
            document.querySelector("#img1").setAttribute("src", fileContent);
            $scope.$apply();
        })

        //jsCoreMethod.fileReader("fileLoad",function(d){
        //    fileContent = d;
        //    document.querySelector("#img1").setAttribute("src",d);
        //    $scope.showImg = true;
        //    $scope.$apply();
        //})

        $scope.createUser = function(){
            var tmp = {
                gh:$scope.gh,       //工号
                cym:$scope.cym,     //曾用名
                xm:$scope.xm,       //姓名
                ywxm:$scope.ywxm,   //英文姓名
                xmpy:$scope.xmpy,   //姓名拼音
                sex:$scope.sex,     //性别
                csrq:new Date($scope.csrq).format(),   //出生日期
                placeNum:$scope.placeNum,  //籍贯
                nationalityNum:$scope.nationalityNum,   //国籍
                nationNum:$scope.nationNum,             //民族
                provincesNum:$scope.provincesNum,       //省
                citysNum:$scope.citysNum,               //市
                downsNum:$scope.downsNum,               //区
                idTypeNum:$scope.idTypeNum,             //证件类型
                zjhm:$scope.zjhm,                       //证件号码
                maritalStatusNum:$scope.maritalStatusNum,//婚姻状况
                macaoNum:$scope.macaoNum,                //港澳台外
                ugwNum:$scope.ugwNum,                   //岗位
                urylxNum:$scope.urylxNum,                //人员类型
                account:$scope.zhanghao,                //账号
                password:$scope.mima,                    //密码
                email:$scope.email
            };

            var e = jsCoreMethod.validateEmail($scope.email,"请输入正常的的邮箱!");
            if(e.bl == false){
                alert(e.msg);
                return;
            }

            var url = "";
            if($stateParams.entity.tag == "edit"){
                url = "/cmsapi/user/update";
                tmp.studentId = $stateParams.entity.studentId;
                tmp.zp = document.querySelector("#img1").getAttribute("src");
            }else{
                url = "/cmsapi/user/add";
                tmp.zp = fileContent;
            }

            enume.postData(url,tmp,function(d){
                alert("保存成功");
                $state.go("safeRoom.userManagement");
            })
        }

        $scope.cancelUser = function(){
            $state.go("safeRoom.userManagement");
        }

    })

    .controller('createTeacherCtrl',function($http,$scope,$state,enume,$stateParams){

        $scope.useSex = enume.userSex;
        $scope.sex = "";
        $scope.nationalityNum = "";
        $scope.placeNum = "";
        $scope.idType = enume.idType;
        $scope.idTypeNum = "";
        $scope.maritalStatus = enume.maritalStatus;
        $scope.maritalStatusNum = "";
        $scope.macao = enume.macao;
        $scope.macaoNum = "";
        $scope.nationNum = "";
        $scope.provinces = enume.provinces;
        $scope.provincesNum = "";
        $scope.citys = [];
        $scope.citysNum = "";
        $scope.downs = [];
        $scope.downsNum = "";

        $scope.uRylxs = enume.uRylxs;
        $scope.urylxNum = "teacher";
        $scope.uGws = enume.uGws;
        $scope.ugwNum = "";

        $scope.utitle = "";
        $scope.showImg = false;

        $scope.zhanghao = "";
        $scope.mima = "";

        $scope.showButton = true;

        function getUserByStuId(){
            enume.getData("/cmsapi/user/queryById?studentId="+$stateParams.entity.studentId,function(tmp){
                $scope.sex = tmp.sex;
                $scope.nationalityNum = tmp.nationalityNum;
                $scope.placeNum = tmp.placeNum;
                $scope.idTypeNum = tmp.idTypeNum;
                $scope.maritalStatusNum = tmp.maritalStatusNum;
                $scope.macaoNum = tmp.macaoNum;
                $scope.nationNum = tmp.nationNum;
                $scope.provincesNum = tmp.provincesNum;
                $scope.citysNum = tmp.citysNum;
                $scope.downsNum = tmp.downsNum;
                $scope.gh = tmp.gh;
                $scope.cym = tmp.cym;
                $scope.xm = tmp.xm;
                $scope.ywxm = tmp.ywxm;
                $scope.xmpy = tmp.xmpy;
                $scope.zjhm = tmp.zjhm;
                $scope.csrq = new Date(tmp.csrq);
                //$scope.urylxNum = tmp.urylxNum;
                $scope.ugwNum = tmp.ugwNum;
                $scope.zhanghao = tmp.account;
                $scope.mima = tmp.password;
                $scope.email = tmp.email;

                document.querySelector("#img1").setAttribute("src",tmp.zp);
            })
        }

        if($stateParams.entity.tag == "edit"){
            getUserByStuId();
            $scope.showImg = true;
            $scope.utitle = "人员修改";
            $scope.showButton = true;
        }
        else if($stateParams.entity.tag == "detail"){
            getUserByStuId();
            $scope.showImg = true;
            $scope.utitle = "人员详情";
            $scope.showButton = false;
        }
        else{
            $scope.showImg = false;
            $scope.utitle = "人员录入";
            $scope.showButton = true;
        }

        $scope.selectProvinces = function(){
            enume.getData("/cmsapi/user/queryCitys?province="+$scope.provincesNum,function(tmp){
                $scope.citys = tmp;
            })
        }

        $scope.selectCitys = function(){
            enume.getData("/cmsapi/user/queryAreas?city="+$scope.citysNum,function(tmp){
                $scope.downs = tmp;
            })
        }

        var fileContent = "";
        jsCoreMethod.fileUploadByFormAjax("fileLoad",function(d){
            fileContent = "/file"+d;
            $scope.showImg = true;
            document.querySelector("#img1").setAttribute("src", fileContent);
            $scope.$apply();
        })

        //jsCoreMethod.fileReader("fileLoad",function(d){
        //    fileContent = d;
        //    document.querySelector("#img1").setAttribute("src",d);
        //    $scope.showImg = true;
        //    $scope.$apply();
        //})

        $scope.createUser = function(){
            var tmp = {
                gh:$scope.gh,       //工号
                cym:$scope.cym,     //曾用名
                xm:$scope.xm,       //姓名
                ywxm:$scope.ywxm,   //英文姓名
                xmpy:$scope.xmpy,   //姓名拼音
                sex:$scope.sex,     //性别
                csrq:new Date($scope.csrq).format(),   //出生日期
                placeNum:$scope.placeNum,  //籍贯
                nationalityNum:$scope.nationalityNum,   //国籍
                nationNum:$scope.nationNum,             //民族
                provincesNum:$scope.provincesNum,       //省
                citysNum:$scope.citysNum,               //市
                downsNum:$scope.downsNum,               //区
                idTypeNum:$scope.idTypeNum,             //证件类型
                zjhm:$scope.zjhm,                       //证件号码
                maritalStatusNum:$scope.maritalStatusNum,//婚姻状况
                macaoNum:$scope.macaoNum,                //港澳台外
                ugwNum:$scope.ugwNum,                   //岗位
                urylxNum:$scope.urylxNum,                //人员类型
                account:$scope.zhanghao,                //账号
                password:$scope.mima,                    //密码
                email:$scope.email
            };

            var e = jsCoreMethod.validateEmail($scope.email,"请输入正常的的邮箱!");
            if(e.bl == false){
                alert(e.msg);
                return;
            }

            var url = "";
            if($stateParams.entity.tag == "edit"){
                url = "/cmsapi/user/update";
                tmp.studentId = $stateParams.entity.studentId;
                tmp.zp = document.querySelector("#img1").getAttribute("src");
            }else{
                url = "/cmsapi/user/add";
                tmp.zp = fileContent;
            }

            enume.postData(url,tmp,function(d){
                alert("保存成功");
                $state.go("safeRoom.userManagement");
            })
        }

        $scope.cancelUser = function(){
            $state.go("safeRoom.userManagement");
        }

    })

    .controller('stuManagementCtrl',function($http,$scope,$state,enume){
        $scope.uList = [];

        $scope.xx = enume.xx;
        $scope.xn = [{name:"全部",code:"0"}];
        $scope.nj = [{name:"全部",code:""}];
        $scope.bj = [{name:"全部",code:""}];
        $scope.xxNum = "";
        $scope.xnNum = "0";
        $scope.njNum = "";
        $scope.bjNum = "";

        $scope.NIANJI = enume.NIANJI;
        $scope.njbh = "";

        $scope.changeXx = function(){
            if($scope.xxNum == ""){
                $scope.xn = [{name:"全部",code:"0"}];
                $scope.nj = [{name:"全部",code:""}];
                $scope.bj = [{name:"全部",code:""}];
            }else{
                enume.getXnByXx($scope.xxNum,function(d){
                    $scope.xn = [{name:"全部",code:"0"}];
                    d = d.datas;
                    for(var i=0;i< d.length;i++){
                        $scope.xn.push({name:d[i],code:d[i]});
                    }
                });
            }
            $scope.xnNum = "0";
            $scope.njNum = "";
            $scope.bjNum = "";
        }

        $scope.changeXn = function(){
            if($scope.xnNum == "0"){
                $scope.nj = [{name:"全部",code:""}];
                $scope.bj = [{name:"全部",code:""}];
            }else{
                enume.getNjByXn($scope.xxNum,$scope.xnNum,function(d){
                    $scope.nj = [{name:"全部",code:""}];
                    for(var i=0;i< d.length;i++){
                        $scope.nj.push({name:d[i].njmc,code:d[i].njbh});
                    }
                });
            }
            $scope.njNum = "";
            $scope.bjNum = "";
        }

        $scope.changeNj = function(){
            if($scope.njNum == ""){
                $scope.bj = [{name:"全部",code:""}];
            }else{
                enume.getBjByXnAndNjBh($scope.xxNum,$scope.xnNum,$scope.njNum,function(d){
                    $scope.bj = [{name:"全部",code:""}];
                    for(var i=0;i< d.length;i++){
                        $scope.bj.push({name:d[i].bjmc,code:d[i].bjbh});
                    }
                });
            }
            $scope.bjNum = "";
        }

        $scope.downLink = "";
        $scope.btnCls = "btnGray";
        $scope.isDisabled = true;

        function downFile(){
            $scope.downLink = "";
            $scope.btnCls = "btnGray";
            $scope.isDisabled = true;
            enume.getData("/cmsapi/tclass/downloadStudent?xxhb="+$scope.xxNum+"&njbh="+$scope.njNum+"&bjbh="+$scope.bjNum+"&xn="+$scope.xnNum,function(d){
                $scope.btnCls = "btnGreen";
                $scope.downLink = "/file/"+d;
                $scope.isDisabled = false;
            })
        }

        downFile();

        $scope.getUrl = function(){
            return "/cmsapi/tclass/queryStudent?xxhb="+$scope.xxNum+"&njbh="+$scope.njNum+"&bjbh="+$scope.bjNum+"&xn="+$scope.xnNum;
        }

        $scope.directiveCallBack = function(valueFromDirective){
            $scope.uList = valueFromDirective;
        }

        var fileContent = "";

        jsCoreMethod.fileReader("fileLoad",function(d){
            fileContent = d;
        },"excel")

        $scope.uploadFile = function(){
            if(!fileContent){
                alert("请选择excel文件上传!");
                return;
            }
            if($scope.njbh == ""){
                alert("请选择一个年级!");
                return;
            }
            $http({
                method:"POST",
                url:"/cmsapi/tclass/uploadStudent?njbh="+$scope.njbh,
                data:{data:fileContent}
            }).success(function(d){
                if(d.status.code == "1"){
                    $scope.$broadcast("searchByFilter");
                    $scope.errorXsl = false;
                    alert("excel上传成功!");
                }else if(d.status.code == "3"){
                    $scope.errorXsl = true;
                    $scope.errorUrl = d.data;
                }else{
                    alert(d.status.message);
                }
            })
        }

        $scope.seachXs = function(){
            $scope.$broadcast("searchByFilter");
            downFile();
        }

        $scope.updateNjItem = function(item){
            $state.go("safeRoom.updateItemClass",{id:item.lineid});
        }
    })

    .controller('editPwdCtrl',function($http,$scope,$state,enume,$stateParams){
        $scope.jmm = "";
        $scope.xmm1 = "";
        $scope.xmm2 = "";

        $scope.resetPwd = function () {
            if($scope.jmm == "" || $scope.xmm1 == "" || $scope.xmm2 == ""){
                alert("旧密码和新密码不允许为空!");
                return;
            }
            if($scope.xmm1 != $scope.xmm2){
                alert("2次输入的新密码不一致!");
                return;
            }
            enume.postData("/cmsapi/user/updatePassword?oldPassword="+$scope.jmm+"&newPassword="+$scope.xmm1,null,function(d){
                enume.postData("/cmsapi/login/logout",null,function(d){
                    $state.go("loginSafe");
                })
            })
        }
    })

    .controller('updateItemClassCtrl',function($http,$scope,$state,enume,$stateParams){
        $scope.bh = $state.params.id;
        $scope.NIANJI = enume.NIANJI;
        $scope.njs = "";
        $scope.bjmc = "";
        $scope.bjbh = "";

        $scope.save = function(){
            enume.postData("/cmsapi/tclass/updateStudentNj?id="+$scope.bh+"&njbh="+$scope.njs+"&bjbh="+$scope.bjbh+"&bjmc="+$scope.bjmc,null,function(){
                $state.go("safeRoom.stuManagement");
            })
        }

        $scope.cannel = function(){
            $state.go("safeRoom.stuManagement");
        }
    })

