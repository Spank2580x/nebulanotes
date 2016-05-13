angular.module('routerApp')
    .controller('homeController', function ($scope, NotesFactory, StorageFactory, NotesService, AnimationService){

        $scope.asideTitle = "Nuovo titolo";

        var debugging = true;

        $(document).ready(function () {
            //La tua roba e' in animationService
        });

        var loadingNotes = true;
        var errorOnLoadingNotes = false;
        $scope.localStoredNotes = [];
        $scope.currentNote;

        var dbLocal = {};
        var firstTimeApp;

        $scope.text = "Ricorda che la vita e' un uragano di speranza che giace spento all'orizzonte... e che fa schifo";
        $scope.title;

        $scope.write = function(){
            console.log("Creazione nuova nota");
            var t = {
                _id: new Date().toISOString(),
                content: "",
                previewContent: "",
                title: "Senza titolo",
                creationDate: new Date().toISOString(),
                lastEditDate: new Date().toISOString()
            };
            dbLocal.put(t, function callback(err, result) {
                if (!err) {
                    //alert("Ce la facciamo a sentire 2 minuti di questo branoooo")
                    dbLocal.changes().on('change', function() {
                        $scope.read();
                    });
                    console.log("Creazione riuscita?" + result);
                    $scope.$apply()
                }
                else {
                    alert(err);
                    alert("Fail");
                }

            });

            //syncPouch();
        }

        $scope.edit = function(){
            console.log("Modifica di ")
            console.log($scope.currentNote);
            if ($scope.currentNote == undefined) console.err("Si sta cercando di modificare una nota che non esiste wtf");
            var t = {
                _id: $scope.currentNote.doc._id,
                _rev: $scope.currentNote.doc._rev,
                content: $scope.text,
                previewContent: $scope.text.substring(0, $scope.text.length > 20 ? 20 : $scope.text.length) + ($scope.text.length > 20 ? "..." : ""),   //TODO farlo localmente, bisogna fare sta roba nell' ng-repeat tipo
                title: $scope.title,
                creationDate: $scope.currentNote.doc.creationDate,
                lastEditDate: new Date().toISOString()
            };
            dbLocal.put(t, function callback(err, result) {
                if (!err) {
                    //alert("Ce la facciamo a sentire 2 minuti di questo branoooo")
                    dbLocal.changes().on('change', function() {
                        $scope.read();
                    });
                    console.log("Modifica riuscita?")
                    console.log(result);
                    singleRead(t._id, function(err, data){
                        if (!err) $scope.open({doc: data});
                        $scope.$apply()
                    });
                }
                else {
                    alert(err);
                    alert("Fail");
                }

            });
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

        $scope.open = function(obj){
            console.log("Visualizzazione di ")
            console.log(obj);
            $scope.currentNote = obj;
            $scope.text = obj.doc.content;
            $scope.title = obj.doc.title;
        }

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

        function singleRead(doc, callback){
            dbLocal.get(doc, function(err, doc) {
                if (err){
                    alert (err);
                }
                else callback(err, doc);
            });
        }

        $scope.delete = function(){
            console.log("Cancellazione");
            for (var i = 0; i < $scope.localStoredNotes.length; i++){
                console.log("Provo a rimuovere");
                console.log($scope.localStoredNotes[i].doc);
                dbLocal.remove($scope.localStoredNotes[i].doc);
            }
            $scope.localStoredNotes = [];
        };

        $scope.addButtonPressed = function(){
            AnimationService.animateAddButton();
            if (firstTimeApp){
                $scope.write();
                backRead(function(err, notes){
                    $scope.currentNote = notes[0];
                })
            }
        }

        function init(){
            //alert("Vai");
            dbLocal = new PouchDB('nebulanotes');
            NotesService.isFirstTimeUsingApp(dbLocal, function(err, result){
                console.log("Prima volta che si usa l'app?");
                if (err) console.log("Buh.. non va un cazzo qua");
                else console.log(result);
                firstTimeApp = true; //TODO dovrebbe essere result
            });
            backRead(function (err, notes){
                if (err) errorOnLoadingNotes = true;
                else loadingNotes = false;
                //$scope.delete();
                console.log($scope.localStoredNotes);
                $scope.delete();
                $scope.$apply()
            });
            //dbRemote = new PouchDB('http://localhost:5984/nebulanotes');
            //dbLocal.sync(dbRemote);
        }

        $scope.dio = function(){
            alert("Dio");
        }

        init();


    });