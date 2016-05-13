angular.module('routerApp')
    .controller('homeController', function ($scope, NotesFactory, StorageFactory, NotesService){

        $scope.title = "Nebula Notes";

        var debugging = true;

        $(document).ready(function () {
            $("#addFeatures").click(function () {
                $(".out").addClass("animated bounceOut");
                $(".blockNote").css("display", "block");
                $(".blockNote").addClass("animated bounceInLeft");
                $("#addFeatures").removeClass("animated infinite bounce");
                setTimeout(function () {
                    $(".divEditor").css("display", "block");
                    $(".divEditor").addClass("animated bounceInDown");
                    $(".no-display").css("display", "block");
                    $(".no-display").addClass("hvr-box-shadow-inset animated bounceInDown");
                }, 600);

            });
        });

        var loadingNotes = true;
        var errorOnLoadingNotes = false;
        $scope.localStoredNotes = [];

        var dbLocal = {};
        var dbRemote = {};

        $scope.text = "asd";
        $scope.a = [1,2,3,4,5];
        $scope.write = function(){
            console.log("Scrittura");
            var t = {
                _id: new Date().toISOString(),
                txt: $scope.text
            };
            dbLocal.put(t, function callback(err, result) {
                if (!err) {
                    alert("Ce la facciamo a sentire 2 minuti di questo branoooo")
                    dbLocal.changes().on('change', function() {
                        $scope.read();
                    });
                    console.log($scope.localStoredNotes);
                    $scope.$apply()
                }
                else {
                    alert(err);
                    alert("Fail");
                }

            });

            //syncPouch();
        }

        $scope.read = function(){
            //console.log("Lettura");
            dbLocal.allDocs({include_docs: true, descending: true}, function(err, doc) {
                if (!err) {
                    /*alert("Oh vai a vedere la console");
                     console.log(err);
                     console.log("L'oggetto:" + doc);*/
                    //$scope.text = doc.rows[0].doc.txt;
                    $scope.localStoredNotes = doc.rows;
                    $scope.$apply()
                }
                else {
                    $scope.localStoredNotes = [-1];
                }
            });
        };

        function backRead(callback){
            console.log("Lettura");
            dbLocal.allDocs({include_docs: true, descending: true}, function(err, doc) {
                if (!err) {
                    /*alert("Oh vai a vedere la console");
                     console.log(err);
                     console.log("L'oggetto:" + doc);*/
                    console.log("Ah ecco!");
                    console.log(doc);
                    //$scope.text = doc.rows[0].doc.txt;
                    $scope.localStoredNotes = doc.rows;
                    $scope.$apply()
                    callback(null, doc.rows);
                }
                else {
                    callback(true, [-1]);
                    return [-1];
                }
            });
        }

        $scope.delete = function(){
            console.log("Cancellazione");
            for (var i = 0; i < $scope.localStoredNotes.length; i++){
                dbLocal.remove($scope.localStoredNotes[i]);
            }
            $scope.localStoredNotes = [];
        };

        function init(){
            //alert("Vai");
            dbLocal = new PouchDB('nebulanotes');
            backRead(function (err, notes){
                if (err) errorOnLoadingNotes = true;
                else loadingNotes = false;
                console.log("Me ne frego e vado avanti");
                //$scope.delete();
                console.log($scope.localStoredNotes);
                $scope.$apply()
            });
            //dbRemote = new PouchDB('http://localhost:5984/nebulanotes');
            //dbLocal.sync(dbRemote);
        }

        function syncPouch(){
            console.log("Sincronizzo");
            dbLocal.replicate.to(dbRemote).on('complete', function () {
                console.log("Ce la facciamo?");
            }).on('error', function (err) {
                console.log(err);
            });
        }




        init();


    });