angular.module('routerApp')
    .controller('homeController', function ($scope,
                                            $state,
                                            $interval,
                                            NotesFactory,
                                            StorageFactory,
                                            NotesService,
                                            AnimationService,
                                            TrafficLightService
    ) {

        $scope.title = "Senza titolo";

        var debugging = true;
        var autoSaveEnabled = false;

        var loadingNotes = true;
        var errorOnLoadingNotes = false;

        $scope.localStoredNotes = [];
        $scope.currentNote;

        var dbLocal = {};
        var firstTimeApp;
        var noteOnQueue;

        $scope.footerMessage = "Tutto a posto ^.^";

        $scope.text = "Ricorda che la vita e' un uragano di speranza che giace spento all'orizzonte... e che fa schifo";
        $scope.title;

        var comparingText;
        var comparingTitle;

        $scope.write = function () {
            console.log("Creazione nuova nota");
            if (TrafficLightService.busy()) {
                console.error("Non mi rompere");
                return;
            }
            TrafficLightService.addLight("Create");
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
                    dbLocal.changes().on('change', function () {
                        $scope.read();

                    });
                    console.log("Creazione riuscita?" + result);
                    //$scope.$apply()

                }
                else {
                    alert(err);
                    alert("Fail");
                }
                TrafficLightService.removeLight("Create");
            });

            //syncPouch();
        }

        $scope.edit = function () {
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
                    dbLocal.changes().on('change', function () {
                        $scope.read();
                    });
                    console.log("Modifica riuscita?")
                    console.log(result);
                    singleRead(t._id, function (err, data) {
                        if (!err) $scope.open({ doc: data });
                        //$scope.$apply()
                    });
                }
                else {
                    alert(err);
                    alert("Fail");
                }

            });
        }

        $scope.read = function () {
            //console.log("Lettura");
            dbLocal.allDocs({ include_docs: true, descending: true }, function (err, doc) {
                if (!err) {
                    /*alert("Oh vai a vedere la console");
                     console.log(err);
                     console.log("L'oggetto:" + doc);*/
                    //$scope.text = doc.rows[0].doc.txt;
                    $scope.localStoredNotes = doc.rows;
                    //$scope.$apply()
                }
                else {
                    $scope.localStoredNotes = [-1];
                }
            });
        };

        $scope.open = function (obj) {
            console.log("Provo ad aprire " + obj.doc.title);
            if (TrafficLightService.busy() || hasBeenEdited()) {
                console.log("Ehi tu!");
                console.log(obj);
                console.log("Aspetta il tuo turno!");
                noteOnQueue = obj;
                if (!TrafficLightService.enabled && hasBeenEdited()){
                    console.error("Buh io cambio pero' guarda che ci sono modifiche non salvate");
                }
                else return;
            }
            console.log("Visualizzazione di ")
            console.log(obj);
            $scope.currentNote = obj;
            $scope.text = obj.doc.content;
            $scope.title = obj.doc.title;
            comparingText = $scope.text;
            comparingTitle = $scope.title;
        }

        function backRead(callback) {
            console.log("Lettura");
            dbLocal.allDocs({ include_docs: true, descending: true }, function (err, doc) {
                if (!err) {
                    /*alert("Oh vai a vedere la console");
                     console.log(err);
                     console.log("L'oggetto:" + doc);*/
                    console.log("Ah ecco!");
                    console.log(doc);
                    //$scope.text = doc.rows[0].doc.txt;
                    $scope.localStoredNotes = doc.rows;
                    //$scope.$apply()
                    callback(null, doc.rows);
                }
                else {
                    callback(true, [-1]);
                    return [-1];
                }
            });
        }

        function backEdit(callbackk, show) {
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
                    dbLocal.changes().on('change', function () {
                        $scope.read();
                    });
                    console.log("Modifica riuscita?")
                    console.log(result);
                    singleRead(t._id, function (err, data) {
                        if (!err && show) {
                            console.log("Ora ti mostro")
                            $scope.open({ doc: data });
                            if (noteOnQueue != undefined) {
                                console.log("Eccomi eccomi arrivo!");
                                $scope.open(noteOnQueue);
                                noteOnQueue = undefined;
                            }
                        }
                        //$scope.$apply()
                    });
                }
                else {
                    alert(err);
                    alert("Fail");
                }
                callbackk(err, result);
            });
        }

        function singleRead(doc, callback) {
            dbLocal.get(doc, function (err, doc) {
                if (err) {
                    alert(err);
                }
                else callback(err, doc);
            });
        }

        $scope.delete = function () {
            console.log("Cancellazione");
            dbLocal.remove($scope.currentNote.doc, function (err, result) {
                if (err) {
                    alert(err);
                    console.error("Cancellazione fallita");
                    console.error("Poi buh io ho provato ad usare: ");
                    console.error($scope.currentNote.doc);
                    return -1;
                }
                backRead(function (err, result) {
                    if (err) alert(err);
                    else {
                        $scope.localStoredNotes = result;
                        if ($scope.localStoredNotes.length > 0) {
                            $scope.currentNote = $scope.localStoredNotes[0];
                            $scope.open($scope.currentNote);
                        }
                    }
                })
            });

        };

        $scope.deleteAll = function(){
            console.log("La nostra ora e' giunta")
            console.log($scope.localStoredNotes);
            $scope.localStoredNotes.forEach(function(x, idx, array){
                dbLocal.remove(x.doc, function (err, result) {
                    if (err) {
                        alert(err);
                        console.error("Cancellazione fallita");
                        console.error("Poi buh io ho provato ad usare: ");
                        console.error(x.doc);
                    }
                    else {
                        console.log("Cancellato");
                        console.log(x.doc);
                        if (idx === array.length - 1){
                            //$state.go('home', {session: result.session});
                        }
                    }
                });
            });
        };

        $scope.addButtonPressed = function () {
            AnimationService.animateAddButton();
            $scope.write();
            backRead(function (err, notes) {
                $scope.currentNote = notes[0];
            })
        }

        $scope.goRed = function () {
            AnimationService.animateRed();
        }

        function init() {
            //alert("Vai");
            TrafficLightService.init(autoSaveEnabled);
            dbLocal = new PouchDB('nebulanotes');
            noteOnQueue = undefined;
            NotesService.isFirstTimeUsingApp(dbLocal, function (err, result) {
                console.log("Prima volta che si usa l'app?");
                if (err) console.log("Buh.. non va un cazzo qua");
                else console.log(result);
                firstTimeApp = result;
                showingFirstTime = result;
            });
            backRead(function (err, notes) {
                if (err) errorOnLoadingNotes = true;
                else loadingNotes = false;
                //$scope.delete();
                console.log($scope.localStoredNotes);
                //$scope.delete();
                //$scope.$apply()
            });
            //dbRemote = new PouchDB('http://localhost:5984/nebulanotes');
            //dbLocal.sync(dbRemote);
        }

        $scope.dio = function () {
            alert("Dio");
        }

        $interval(function () {
            //console.log("Mio padre mi ha insegnato a salvare da solo:")
            //console.log(TrafficLightService.busy() + " " + noteOnQueue);
            if (!autoSaveEnabled) return;
            $scope.footerMessage = TrafficLightService.busy() ? "Solo un momento... c.c " + JSON.stringify($scope.footerMessage) : "Tutto a posto ^.^";
            if (TrafficLightService.busy() || $scope.currentNote == undefined || !hasBeenEdited()) return;
            console.log("Autosalvataggio");
            TrafficLightService.addLight("Autosave");
            backEdit(function (err, data) {
                TrafficLightService.removeLight("Autosave");
                updateComparing();
            }, true)
        }, 1000);

        function hasBeenEdited() {
            return $scope.text != comparingText ||
                    $scope.title != comparingTitle;
        }

        function updateComparing() {
            comparingText = $scope.text;
            comparingTitle = $scope.title;
        }

        init();

        $(document).ready(function () {
            $('body').tooltip({
                selector: "[data-tooltip=tooltip]",
                container: "body"
            });

           $(function () {
               $('[data-tooltip="tooltip"]').click(function () {
                    $(this).tooltip("destroy");
                })
            });
 
        });

    });