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
        var localStoredNotes = {};

        var dbLocal = {};
        var dbRemote = {};

        $scope.text = "asd";

        $scope.write = function dummyWrite(){
            console.log("Scrittura");
            var t = {
                _id: new Date().toISOString(),
                txt: $scope.text
            };
            dbLocal.put(t, function callback(err, result) {
                if (!err) {
                    alert("Ce la facciamo a sentire 2 minuti di questo branoooo")
                    dbLocal.changes().on('change', function() {
                        console.log('Basta');
                    });
                }
                else {
                    alert(err);
                    alert("Fail");
                }

            });
            //syncPouch();
        }

        $scope.read = function dummyRead(){
            console.log("Lettura");
            dbLocal.allDocs({include_docs: true, descending: true}, function(err, doc) {
                if (!err) {
                    /*alert("Oh vai a vedere la console");
                    console.log(err);
                    console.log("L'oggetto:" + doc);*/
                    console.log(doc);
                    $scope.text = doc.rows[0].doc.txt;
                }
            });
        }

        function init(){
            //alert("Vai");
            dbLocal = new PouchDB('nebulanotes');
            dbRemote = new PouchDB('http://localhost:5984/nebulanotes');
            dbLocal.sync(dbRemote);
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