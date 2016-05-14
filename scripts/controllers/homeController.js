angular.module('routerApp')
    .controller('homeController', function ($scope,
                                            $interval,
                                            NotesFactory,
                                            StorageFactory,
                                            NotesService,
                                            AnimationService,
                                            TrafficLightService
    ){

        $scope.title = "Senza titolo";

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

        var comparingText;
        var comparingTitle;

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
                previewContent: $scope.text.substring(0, $scope.text.length > 40 ? 40 : $scope.text.length) + ($scope.text.length > 40 ? "..." : ""),   //TODO farlo localmente, bisogna fare sta roba nell' ng-repeat tipo
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
            comparingText = $scope.text;
            comparingTitle = $scope.title;
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

        function backEdit(callbackk){
            console.log("Modifica di ")
            console.log($scope.currentNote);
            if ($scope.currentNote == undefined) console.err("Si sta cercando di modificare una nota che non esiste wtf");
            var t = {
                _id: $scope.currentNote.doc._id,
                _rev: $scope.currentNote.doc._rev,
                content: $scope.text,
                previewContent: $scope.text.substring(0, $scope.text.length > 40 ? 40 : $scope.text.length) + ($scope.text.length > 40 ? "..." : ""),   //TODO farlo localmente, bisogna fare sta roba nell' ng-repeat tipo
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
                callbackk(err, result);
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
            dbLocal.remove($scope.currentNote.doc, function(err, result){
                if (err){
                    alert(err);
                    console.error("Cancellazione fallita");
                    console.error("Poi buh io ho provato ad usare: ");
                    console.error($scope.currentNote.doc);
                    return -1;
                }
                backRead(function(err, result){
                    if (err) alert(err);
                    else {
                        $scope.localStoredNotes = result;
                        if ($scope.currentNote.length > 0) {
                            $scope.currentNote = $scope.localStoredNotes[$scope.localStoredNotes.length -1];
                            $scope.open($scope.currentNote);
                        }
                    }
                })
            });

        };

        $scope.addButtonPressed = function(){
            AnimationService.animateAddButton();
            $scope.write();
            backRead(function(err, notes){
                    $scope.currentNote = notes[0];
            })
        }

        $scope.goBlack = function () {
            AnimationService.animateBlack();
        }

        function init(){
            //alert("Vai");
            TrafficLightService.init();
            dbLocal = new PouchDB('nebulanotes');
            NotesService.isFirstTimeUsingApp(dbLocal, function(err, result){
                console.log("Prima volta che si usa l'app?");
                if (err) console.log("Buh.. non va un cazzo qua");
                else console.log(result);
                firstTimeApp = result;
                showingFirstTime = result;
            });
            backRead(function (err, notes){
                if (err) errorOnLoadingNotes = true;
                else loadingNotes = false;
                //$scope.delete();
                console.log($scope.localStoredNotes);
                //$scope.delete();
                $scope.$apply()
            });
            //dbRemote = new PouchDB('http://localhost:5984/nebulanotes');
            //dbLocal.sync(dbRemote);
        }

        $scope.dio = function(){
            alert("Dio");
        }

        $interval(function(){
            if (TrafficLightService.busy() || $scope.currentNote == undefined || !hasBeenEdited()) return;
            console.log("Autosalvataggio");
            TrafficLightService.addLight("Autosave");
            backEdit(function (err, data){
                TrafficLightService.removeLight("Autosave");
                updateComparing();
            })
        }, 1000);

        function hasBeenEdited(){
            return $scope.text != comparingText ||
                    $scope.title != comparingTitle;
        }

        function updateComparing(){
            comparingText = $scope.text;
            comparingTitle = $scope.title;
        }

        init();


    });