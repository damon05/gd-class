/**
 * Created by carol on 16/5/18.
 */
'use strict';

angular.module('app').config(function($stateProvider){
    $stateProvider
        .state('safeRoom',{
            url: '/safeRoom',
            templateUrl: "./Module/SafeClassRoom/main/safeMain.html"
        })
        //模板路由
        .state('safeRoom.templateList', {
            url: '/templateList',
            params:{entity:{}},
            cache:false,
            templateUrl: "./Module/SafeClassRoom/template/templateList.html",
            controller: 'templateListCtrl'
        })
        .state('safeRoom.templateCreate',{
            url:'/createTemplate',
            params:{entity:{}},
            templateUrl:"./Module/SafeClassRoom/template/createTemplate.html",
            controller:"createTemplateCtrl"
        })
        .state('safeRoom.lessonsList',{
            url:'/lessonsList',
            params:{entity:{}},
            templateUrl:"./Module/SafeClassRoom/template/lessonsList.html",
            controller:"lessonsListCtrl1"
        })
        .state('safeRoom.lessonsEdit',{
            url:'/lessonsList/:id',
            params:{entity:{}},
            templateUrl:"./Module/SafeClassRoom/template/lessonsEdit.html",
            controller:"lessonsEditCtrl1"
        })
        //数据分析
        .state('safeRoom.surveyAnalysisList',{
            url:'/surveyAnalysisList',
            params:{entity:{}},
            templateUrl:'./Module/SafeClassRoom/analysis/surveyAnalysisList.html',
            controller:'surveyAnalysisListCtrl'
        })
        .state('safeRoom.surveyAnalysisDetail',{
            url:'/surveyAnalysisList/:id',
            templateUrl:'./Module/SafeClassRoom/analysis/surveyAnalysisDetail.html',
            controller:'surveyAnalysisDetailCtrl'
        })
        .state('safeRoom.surveyInfoList',{
            url:'/surveyInfoList',
            params:{entity:{}},
            templateUrl:'./Module/SafeClassRoom/analysis/surveyInfoList.html',
            controller:'surveyInfoListCtrl'
        })
        .state('safeRoom.surveyInfoDetail',{
            url:'/surveyInfoList/:id',
            params:{entity:{}},
            templateUrl:'./Module/SafeClassRoom/analysis/surveyInfoDetail.html',
            controller:'surveyInfoDetailCtrl'
        })
        .state('safeRoom.lessons',{
            url:'/surveyLessonsList',
            params:{entity:{}},
            templateUrl:'./Module/SafeClassRoom/analysis/lessonsList.html',
            controller:'lessonsListCtrl'
        })
        .state('safeRoom.students',{
            url:'/studentList/:id',
            params:{entity:{}},
            templateUrl:'./Module/SafeClassRoom/analysis/studentList.html',
            controller:'studentListCtrl'
        })
        //用户
        .state('safeRoom.userManagement',{
            url:'/userManagement',
            templateUrl:'./Module/SafeClassRoom/user/userManagement.html',
            controller:'userManagementCtrl'
        })
        .state('safeRoom.classManagement',{
            url:'/classManagement',
            params:{entity:{}},
            templateUrl:'./Module/SafeClassRoom/user/classManagement.html',
            controller:'classManagementCtrl'
        })
        .state('safeRoom.createUser',{
            url:'/createUser',
            params:{entity:{}},
            templateUrl:'./Module/SafeClassRoom/user/createUser.html',
            controller:'createUserCtrl'
        })
        .state('safeRoom.createTeacher',{
            url:'/createTeacher',
            params:{entity:{}},
            templateUrl:'./Module/SafeClassRoom/user/createTeacher.html',
            controller:'createTeacherCtrl'
        })
        .state('safeRoom.updateItemClass',{
            url:'/updateItemClass/:id',
            params:{entity:null},
            templateUrl:'./Module/SafeClassRoom/user/updateItemClass.html',
            controller:'updateItemClassCtrl'
        })
        .state('safeRoom.stuManagement',{
            url:'/stuManagement',
            params:{entity:{}},
            templateUrl:'./Module/SafeClassRoom/user/stuManagement.html',
            controller:'stuManagementCtrl'
        })
        .state('safeRoom.editPwd',{
            url:'/editPwd',
            params:{entity:{}},
            templateUrl:'./Module/SafeClassRoom/user/editPwd.html',
            controller:'editPwdCtrl'
        })
        //作业路由
        .state('safeRoom.homeworkCreate', {
            url: '/createHomework',
            params: { entity: {} },
            templateUrl: './Module/SafeClassRoom/homework/createHomework.html?v=1290',
            controller: 'createHomeworkCtrl'
        })
        .state('safeRoom.homeworkList', {
            url: '/homeworkList',
            params: { entity: { Type: "0" } },
            templateUrl: './Module/SafeClassRoom/homework/homeworkList.html?v=1296',
            controller: 'homeworkListCtrl'
        })
        //作业题目路由
        .state('safeRoom.questionCreate', {
            url: '/createQuestion',
            params: { entity: {} },
            templateUrl: './Module/SafeClassRoom/question/createQuestion.html?v=1291',
            controller: 'createQuestionCtrl'
        })
        .state('safeRoom.questionList', {
            url: '/questionList',
            params: { entity: {} },
            templateUrl: './Module/SafeClassRoom/question/questionList.html?v=1293',
            controller: 'questionListCtrl'
        })
        //调查问卷 
        .state('safeRoom.surveyList', {
            url: '/surveyList',
            params: { entity: { Type: "1" } },
            templateUrl: './Module/SafeClassRoom/homework/homeworkList.html?v=1298',
            controller: 'homeworkListCtrl'
        })
        //工地管理
        .state('safeRoom.train', {
            url: '/train',
            params:{entity:null},
            templateUrl: "/Module/SafeClassRoom/train/list.html",
            controller: 'trainCtrl'
        })
        .state('safeRoom.report', {
            url: '/report',
            params:{entity:null},
            templateUrl: "/Module/SafeClassRoom/report/list.html",
            controller: 'reportCtrl'
        })
        .state('safeRoom.score', {
            url: '/score',
            params:{entity:null},
            templateUrl: "/Module/SafeClassRoom/score/list.html",
            controller: 'scoreCtrl'
        })
});