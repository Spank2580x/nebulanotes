angular.module('routerApp')
    .controller('homeController', function ($scope,
                                            $state,
                                            $interval,
                                            NotesFactory,
                                            StorageFactory,
                                            NotesService,
                                            AnimationService,
                                            TrafficLightService,
                                            ColorService
    ) {

        $scope.title = "Senza titolo";
        $scope.category = "Categoria";

        var debugging = true;
        var autoSaveEnabled = false;

        var loadingNotes = true;
        var errorOnLoadingNotes = false;

        $scope.localStoredNotes = [];
        $scope.currentNote;
        $scope.showingNote = false;

        $scope.searchText;
        $scope.noSearchResult = false;

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
                title: "Senza titolo",
                creationDate: getNow(),
                lastEditDate: getNow(),
                //color: "rgba(255, 255, 255, .0);"
                color: ColorService.getRandomColor()
            };
            dbLocal.put(t, function callback(err, result) {
                if (!err) {
                    //alert("Ce la facciamo a sentire 2 minuti di questo branoooo")
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

        $scope.edit = function(){
            console.log("Modifica di ")
            console.log($scope.currentNote);
            if ($scope.currentNote == undefined) console.error("Si sta cercando di modificare una nota che non esiste wtf");
            var t = {
                _id: $scope.currentNote.doc._id,
                _rev: $scope.currentNote.doc._rev,
                content: $scope.text,
                title: $scope.title,
                creationDate: $scope.currentNote.doc.creationDate,
                lastEditDate: getNow(),
                color: $scope.currentNote.doc.color
            };
            console.log("T ha anche ");
            console.log(t.color);
            dbLocal.put(t, function callback(err, result) {
                if (!err) {
                    //alert("Ce la facciamo a sentire 2 minuti di questo branoooo")
                    /*dbLocal.changes().on('change', function () {
                     $scope.read();                                  //<---- flickera
                     });*/
                    console.log("Modifica riuscita?")
                    console.log(result);
                    backRead(function(err, result){
                        if (err){
                            alert(err);
                            alert("Fail");
                        }
                        else {
                            singleRead(t._id, function (err, data) {
                                if (!err) {
                                    $scope.open({ doc: data });
                                    $scope.sortByLastEdit();
                                }
                                //$scope.$apply()
                            });
                        }
                    });
                }
                else {
                    alert(err);
                    alert("Fail");
                }

            });
        }

        $scope.editColor = function(color){
            console.log("Modifica colore di ")
            console.log($scope.currentNote);
            if ($scope.currentNote == undefined) console.err("Si sta cercando di modificare una nota che non esiste wtf");
            var t = {
                _id: $scope.currentNote.doc._id,
                _rev: $scope.currentNote.doc._rev,
                content: $scope.text,
                title: $scope.title,
                creationDate: $scope.currentNote.doc.creationDate,
                lastEditDate: getNow(),
                color: color
            };
            dbLocal.put(t, function callback(err, result) {
                if (!err) {
                    //alert("Ce la facciamo a sentire 2 minuti di questo branoooo")
                    /*dbLocal.changes().on('change', function () {
                     $scope.read();                                  //<---- flickera
                     });*/
                    console.log("Modifica del colore riuscita?")
                    console.log(result);
                    backRead(function(err, result){
                        if (err){
                            alert(err);
                            alert("Fail");
                        }
                        else {
                            singleRead(t._id, function (err, data) {
                                if (!err) {
                                    $scope.open({ doc: data });
                                    $scope.sortByLastEdit();
                                }
                                //$scope.$apply()
                            });
                        }
                    });
                }
                else {
                    alert(err);
                    alert("Fail");
                }

            });
        }

        $scope.isNoteOpaque = function(x){
            if (x == undefined || x.doc == undefined || x.doc.color == undefined) return;
            return ColorService.isOpaque(x.doc.color);
        }

        $scope.read = function () {
            //console.log("Lettura");
            dbLocal.allDocs({ include_docs: true, descending: true }, function (err, doc) {
                if (!err) {
                    /*alert("Oh vai a vedere la console");
                     console.log(err);
                     console.log("L'oggetto:" + doc);*/
                    //$scope.text = doc.rows[0].doc.txt;
                    console.log("Dystopia!");
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
                    console.log("Buh io cambio pero' guarda che ci sono modifiche non salvate");
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
                title: $scope.title,
                creationDate: $scope.currentNote.doc.creationDate,
                lastEditDate: getNow(),
                color: $scope.currentNote.color
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
                        console.log("Esco fresco da un backRead, queste sono le note:");
                        console.log(result);
                        $scope.localStoredNotes = result;
                        if ($scope.localStoredNotes.length > 0) {
                            $scope.currentNote = $scope.localStoredNotes[0];
                            $scope.open($scope.currentNote);
                        }
                        else {
                            location.reload();
                        }
                    }
                })
            });

        };

        $scope.deleteAll = function(){
            console.log("La nostra ora e' giunta")
            console.log($scope.localStoredNotes);
            if ($scope.localStoredNotes.length == 0) location.reload();
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
                            location.reload();
                            //$state.go('home', {session: result.session});
                        }
                    }
                });
            });
        };

        $scope.addButtonPressed = function () {
            if (firstTimeApp) {
                AnimationService.animateAddButton();
                firstTimeApp = false;
            }
            else AnimationService.animateEditButton(1);
            $scope.showingNote = false;;
            $scope.write();
            backRead(function (err, notes) {
                $scope.currentNote = notes[0];
                $scope.open($scope.currentNote);
                $scope.sortByLastEdit();
            })
        }

        $scope.editButtonPressed = function () {
            AnimationService.animateEditButton();
            $scope.showingNote = !$scope.showingNote;
        }

        $scope.goRed = function () {
            AnimationService.animateRed();
        }

        $scope.sortByLastEdit = function(){
            $scope.localStoredNotes.sort(function(a,b) {
                return (a.doc.lastEditDate.millis < b.doc.lastEditDate.millis) ? 1 : ((b.doc.lastEditDate.millis < a.doc.lastEditDate.millis) ? -1 : 0);}
            );
        }

        function init() {
            //alert("Vai");
            TrafficLightService.init(autoSaveEnabled);
            AnimationService.init();
            dbLocal = new PouchDB('nebulanotes');
            noteOnQueue = undefined;
            NotesService.isFirstTimeUsingApp(dbLocal, function (err, result) {
                console.log("Prima volta che si usa l'app?");
                if (err) console.log("Buh.. non va un cazzo qua");
                else console.log(result);
                firstTimeApp = result;
                showingFirstTime = result;
                if (!showingFirstTime) {
                    AnimationService.checkFirstTouch();
                }
                else {
                    AnimationService.isFirstTouch();

                }
            });
            backRead(function (err, notes) {
                if (err) errorOnLoadingNotes = true;        //TODO GESTIRE SCHERMATA DI ERRORE
                else loadingNotes = false;
                //$scope.delete();
                console.log("Sono il primo backRead");
                console.log($scope.localStoredNotes);
                if ($scope.localStoredNotes.length > 0){
                    $scope.sortByLastEdit();
                    $scope.currentNote = $scope.localStoredNotes[0];
                    $scope.open($scope.currentNote);
                }
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

        function getNow(){
            var d = new Date();
            return {
                day: d.getDate(),
                year: d.getFullYear(),
                hours: d.getHours(),
                minute: d.getMinutes(),
                seconds: d.getSeconds(),
                month: d.getMonth() + 1,
                millis: d.getTime()
            }
        }

        $scope.previewText = function(x){
            return removeTags(x.substring(0, x.length > 40 ? 40 : x.length) + (x.length > 40 ? "..." : ""));
        }

        function removeTags(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }

        $scope.formatLastEditTime = function(time){
            var now = getNow();
            var difference = now.millis - time.millis;
            difference = Math.round(difference / 1000);
            if (difference < 60) return "Pochi secondi fa";
            if (difference < 120) return "Un minuto fa";
            if (difference < 3600) return Math.round(difference / 60) + " minuti fa";
            if (difference < 7200) return "Un ora fa";
            if (difference < 86400) return Math.round(difference / 3600) + " ore fa";
            if (difference < 172800) return "Ieri";
            else return Math.round(difference / 86400) + " giorni fa";
            return difference;
        }

        $scope.searchFilter = function(x){
            if ($scope.searchText == undefined || $scope.searchText.length <= 1) return true;
            var title = x.doc.title.toLowerCase();
            var content = x.doc.content.toLowerCase();
            var toSearch = $scope.searchText.toLowerCase();
            return title.includes(toSearch) || content.includes(toSearch);
        }

        $(document).ready(function () {
            $('body').tooltip({
                selector: "[data-tooltip=tooltip]",
                container: "body"
            });

           
               $('[data-tooltip="tooltip"]').click(function () {
                    $(this).tooltip("destroy");
                })
            
               $('.rectFeaturesSettings').click(function () {
                   $('.sidebar-offcanvas').toggleClass('active', 1000);
               });
           
            /*.title:not(#sidebarIcon) is not working */
               $('.logoCentered, .sectionNotes, #addMobile, #editMobile').click(function () {
               $('.sidebar-offcanvas').removeClass('active', 1000);
           });
          
        });

        init();

    });
