angular.module('routerApp')
    .controller('homeController', function ($scope, NotesFactory, StorageFactory, NotesService){

        $scope.title = "Nebula Notes";

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
        var localStoredNotes = [];

        var dbLocal = {};
        var dbRemote = {};

        $scope.text = "asd";

        $scope.write = function(){
            consoleDebug("Scrittura");
            var t = {
                _id: new Date().toISOString(),
                txt: $scope.text
            };
            dbLocal.put(t, function callback(err, result) {
                if (!err) {
                    alert("Ce la facciamo a sentire 2 minuti di questo branoooo")
                    dbLocal.changes().on('change', function() {
                        consoleDebug('Basta');
                        localStoredNotes = $scope.read();
                    });
                }
                else {
                    alert(err);
                    alert("Fail");
                }

            });

            //syncPouch();
        }

        $scope.read = function(){
            consoleDebug("Lettura");
            dbLocal.allDocs({include_docs: true, descending: true}, function(err, doc) {
                if (!err) {
                    /*alert("Oh vai a vedere la console");
                     console.log(err);
                     console.log("L'oggetto:" + doc);*/
                    consoleDebug("Ah ecco!");
                    consoleDebug(doc);
                    //$scope.text = doc.rows[0].doc.txt;
                    return doc.rows;
                }
                else {
                    return [-1];
                }
            });
        };

        function backRead(callback){
            consoleDebug("Lettura");
            dbLocal.allDocs({include_docs: true, descending: true}, function(err, doc) {
                if (!err) {
                    /*alert("Oh vai a vedere la console");
                     console.log(err);
                     console.log("L'oggetto:" + doc);*/
                    consoleDebug("Ah ecco!");
                    consoleDebug(doc);
                    //$scope.text = doc.rows[0].doc.txt;
                    callback(null, doc.rows);
                    return doc.rows;
                }
                else {
                    callback(true, [-1]);
                    return [-1];
                }
            });
        }

        $scope.delete = function(){
            consoleDebug("Cancellazione");
            for (var i = 0; i < localStoredNotes.length; i++){
                dbLocal.remove(localStoredNotes[i]);
            }
            localStoredNotes = [];
        };

        function init(){
            //alert("Vai");
            dbLocal = new PouchDB('nebulanotes');
            localStoredNotes = $scope.read(function (err, notes){
                if (err) errorOnLoadingNotes = true;
                else loadingNotes = false;
            });
            consoleDebug("Me ne frego e vado avanti");
            //$scope.delete();
            consoleDebug(localStoredNotes);
            //dbRemote = new PouchDB('http://localhost:5984/nebulanotes');
            //dbLocal.sync(dbRemote);
        }

        function syncPouch(){
            consoleDebug("Sincronizzo");
            dbLocal.replicate.to(dbRemote).on('complete', function () {
                consoleDebug("Ce la facciamo?");
            }).on('error', function (err) {
                consoleDebug(err);
            });
        }

        var debugging = true;
        function consoleDebug(m){
            if (debugging) console.log(m);
        }

        init();


    });