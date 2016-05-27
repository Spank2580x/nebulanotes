angular.module('routerApp')
    .controller('homeController', function ($scope,
                                            $state,
                                            $interval,
                                            NotesFactory,
                                            StorageFactory,
                                            NotesService,
                                            AnimationService,
                                            TrafficLightService,
                                            ColorService,
                                            uploadS3,
                                            VideoService,
                                            AwsService
    ) {

        $scope.title = "Senza titolo";
        $scope.category = "Categoria";

        var debugging = true;
        var autoSaveEnabled = true;

        var loadingNotes = true;
        var errorOnLoadingNotes = false;

        $scope.localStoredNotes = [];
        $scope.currentNote;
        //$scope.showingNote = false;

        $scope.searchText;
        $scope.noSearchResult = false;

        var dbLocal = {};
        var firstTimeApp;
        var noteOnQueue;

        $scope.footerMessage = "Tutto a posto ^.^";

        $scope.trashedNumber = 0;

        $scope.text = "";
        $scope.place = "Ricorda che la vita e' un uragano di speranza che nel tempo scompare all'orizzonte..."
        $scope.title;

        var comparingText;
        var comparingTitle;
        var comparingTags;

        var noteToRestore = [];


        $scope.downloadedNote = false;
        $scope.downloading = false;

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
                color: ColorService.getRandomColor(),
                tags: [],
                trashed: false,
                font: "gloria"
            };
            dbLocal.put(t, function callback(err, result) {
                if (!err) {
                    //alert("Ce la facciamo a sentire 2 minuti di questo branoooo")
                    console.log("Creazione riuscita?" + result);
                    //$scope.$apply()
                    $scope.footerMessage = "Ho creato una nuova nota";
                }
                else {
                    notifyError(err);
                }
                TrafficLightService.removeLight("Create");
            });

            //syncPouch();
        }

        $scope.edit = function(){
            console.log($('.selectCategories').val());
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
                color: $scope.currentNote.doc.color,
                tags: $('.selectCategories').val(),
                trashed: $scope.currentNote.doc.trashed,
                font: $scope.currentNote.doc.font
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
                            notifyError(err);
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
                    notifyError(err);
                }

            });
        }

        $scope.editColor = function(color){
            console.log("Modifica colore di ")
            console.log($scope.currentNote);
            if ($scope.currentNote == undefined) console.error("Si sta cercando di modificare una nota che non esiste wtf");
            var t = {
                _id: $scope.currentNote.doc._id,
                _rev: $scope.currentNote.doc._rev,
                content: $scope.text,
                title: $scope.title,
                creationDate: $scope.currentNote.doc.creationDate,
                lastEditDate: getNow(),
                color: color,
                tags: $('.selectCategories').val(),
                trashed: $scope.currentNote.doc.trashed,
                font: $scope.currentNote.doc.font
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
                            notifyError(err);
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
                    notifyError(err);
                }

            });
        }

        $scope.editFont = function(font){
            console.log("Modifica font di ")
            console.log($scope.currentNote);
            if ($scope.currentNote == undefined) console.error("Si sta cercando di modificare una nota che non esiste wtf");
            var t = {
                _id: $scope.currentNote.doc._id,
                _rev: $scope.currentNote.doc._rev,
                content: $scope.text,
                title: $scope.title,
                creationDate: $scope.currentNote.doc.creationDate,
                lastEditDate: getNow(),
                color: $scope.currentNote.doc.color,
                tags: $('.selectCategories').val(),
                trashed: $scope.currentNote.doc.trashed,
                font: font
            };
            dbLocal.put(t, function callback(err, result) {
                if (!err) {
                    //alert("Ce la facciamo a sentire 2 minuti di questo branoooo")
                    /*dbLocal.changes().on('change', function () {
                     $scope.read();                                  //<---- flickera
                     });*/
                    console.log("Modifica del font riuscito?")
                    console.log(result);
                    backRead(function(err, result){
                        if (err){
                            notifyError(err);
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
                    notifyError(err);
                }

            });
        }

        $scope.trash = function(){
            if ($scope.localStoredNotes.filter(function(x){return !x.doc.trashed}).length == 1){
                $scope.footerMessage = "Non puoi cancellare la tua unica nota!";
                return;
            }
            console.log("Cestinazione di ");
            console.log($scope.currentNote);
            if ($scope.currentNote == undefined) console.error("Si sta cercando di modificare una nota che non esiste wtf");
            var t = {
                _id: $scope.currentNote.doc._id,
                _rev: $scope.currentNote.doc._rev,
                content: $scope.text,
                title: $scope.title,
                creationDate: $scope.currentNote.doc.creationDate,
                lastEditDate: getNow(),
                color: $scope.currentNote.doc.color,
                tags: $('.selectCategories').val(),
                trashed: true,
                font: $scope.currentNote.doc.font
            };
            dbLocal.put(t, function callback(err, result) {
                if (!err) {
                    //alert("Ce la facciamo a sentire 2 minuti di questo branoooo")
                    /*dbLocal.changes().on('change', function () {
                     $scope.read();                                  //<---- flickera
                     });*/
                    console.log("Cestinazione riuscita?")
                    console.log(result);
                    backRead(function(err, result){
                        if (err){
                            notifyError(err);
                        }
                        else {
                            /*singleRead(t._id, function (err, data) {
                                if (!err) {
                                    $scope.open({ doc: data });
                                    $scope.sortByLastEdit();
                                }
                                //$scope.$apply()
                            });*/
                            console.log("Quando tutte le ombre cadranno!")
                            console.log($scope.localStoredNotes.length);
                            if ($scope.localStoredNotes.filter(function(x){return !x.doc.trashed}).length > 0) openLastReadable();
                            $scope.footerMessage = "Nota cancellata";
                        }
                    });
                }
                else {
                    notifyError(err);
                }

            });
        }

        $scope.thereAreNotes = function(){
            return $scope.localStoredNotes.filter(function(x){return !x.doc.trashed}).length > 0;
        }

        $scope.thereAreTrashed = function(){
            return $scope.localStoredNotes.filter(function(x){return x.doc.trashed}).length > 0;
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

        $scope.open = function (obj, switching) {
            if (switching) AnimationService.checkFirstTouch();
            console.log("Provo ad aprire " + obj.doc.title);
            if (TrafficLightService.busy() || hasBeenEdited()) {
                if (TrafficLightService.busy()) console.log("Ci sono semafori attivi quindi...");
                if (hasBeenEdited()) console.log("E' stato modificato quindi...");
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
            $scope.openTags(obj);
            comparingText = $scope.text;
            comparingTitle = $scope.title;
            updateComparing();
        }

        $scope.openTags = function(obj){
            //var $multi = $('select').select2();
            console.log("Cambiero' i tag con:");
            console.log(obj.doc.tags);
            $('.selectCategories').val(null);
            if (obj.doc.tags != null){
                obj.doc.tags.forEach(function(x){
                    $('.selectCategories').append("<option value='" + x + "' selected>" + x + "</option>", true);
                })
            }
            $('.selectCategories').trigger('change');
            //$(".js-programmatic-multi-set-val").on("click", function () { $exampleMulti.val(["CA", "AL"]).trigger("change"); });
            //$('select').select2('val', ['kjkjkl','jkjkjkjkjk']);
            //$(".js-programmatic-multi-set-val").on("click", function () { $multi.val(["cacca","cacca"]).trigger("change"); });
            //$(".js-programmatic-multi-clear").on("click", function () { $exampleMulti.val(null).trigger("change"); });
        }

        $scope.upBucket = function (){
            alert("bhotftfyfyfyf");
            //uploadS3.buf(notes.doc._id);
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

                    $scope.trashedNumber = $scope.localStoredNotes.filter(function(x){
                        return x.doc.trashed
                    }).length;
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
            console.log($('.selectCategories').val());
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
                color: $scope.currentNote.doc.color,
                tags: $('.selectCategories').val(),
                font: $scope.currentNote.doc.font
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
                            notifyError(err);
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
                    notifyError(err);
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
                AnimationService.animateAddButton(1);
                firstTimeApp = false;
            }
            else AnimationService.animateEditButton(1);
            //$scope.showingNote = false;;
            $scope.write();
            backRead(function (err, notes) {
                $scope.currentNote = notes[0];
                $scope.open($scope.currentNote);
                $scope.sortByLastEdit();
            })
        }

        $scope.editButtonPressed = function () {
            AnimationService.animateEditButton();
            //$scope.showingNote = !$scope.showingNote;
        }

        $scope.goRed = function () {
            AnimationService.animateRed();
        }

        $scope.sortByLastEdit = function(){
            $scope.localStoredNotes.sort(function(a,b) {
                return (a.doc.lastEditDate.millis < b.doc.lastEditDate.millis) ? 1 : ((b.doc.lastEditDate.millis < a.doc.lastEditDate.millis) ? -1 : 0);}
            );
        }

        $scope.restoreTrashed = function(all){
            if (all && !$scope.thereAreTrashed()) return;
            if (!all && $scope.isRestoringEmpty()) return;
            console.log("Ehi...");
            var docs = [];
            backRead(function(err, data){
                if (err) {
                    alert("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHH!!!!!!!!!!!!");
                    alert(err);
                }
                else {
                    for (var i = 0; i < data.length; i++){
                        console.log("Eccone uno");
                        console.log(data[i]);
                        docs.push(data[i].doc);
                    }
                    docs.filter(function(x){
                        return all ? true : isInRestoring(x);
                    })
                        .forEach(function(x){
                        x.trashed = false;
                    })
                    console.log("Allora ecco la gente");
                    console.log(data);
                    dbLocal.bulkDocs(docs, function(err, data){
                        if (err) {
                            alert("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHH!!!!!!!!!!!!");
                            alert(err);
                        }
                        else {
                            console.log("Tutto fatto sembra...");
                            console.log(data);
                            backRead(function(err, data){
                                $scope.sortByLastEdit();
                                /*$scope.currentNote = $scope.localStoredNotes[0];
                                $scope.open($scope.currentNote);
                                */
                            });
                        }
                    })
                    var bestemmio = noteToRestore.length == 1;
                    $scope.footerMessage = (bestemmio ? "Nota" : "Note") + " " + (bestemmio ? "ripristinata" : "ripristinate");
                    noteToRestore = [];
                }
            });
        }

        $scope.initVideo = function(){
            VideoService.init();
        }

        function init() {
            //alert("Vai");
            AwsService.init();
            TrafficLightService.init(autoSaveEnabled);
            AnimationService.init();
            initSelect2();

            //uploadS3.init();
            dbLocal = new PouchDB('nebulanotes');
            noteOnQueue = undefined;
            comparingTags = [];
            NotesService.isFirstTimeUsingApp(dbLocal, function (err, result) {
                console.log("Prima volta che si usa l'app?");
                if (err) console.log("Buh.. non va un cazzo qua");
                else console.log(result);
                firstTimeApp = result;
                showingFirstTime = result;
                if (!showingFirstTime) {
                    AnimationService.checkFirstTouch();
                    AnimationService.animateEditButton();
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
                    openLastReadable();
                }
                //$scope.delete();
                //$scope.$apply()
            });
            //dbRemote = new PouchDB('http://localhost:5984/nebulanotes');
            //dbLocal.sync(dbRemote);
        }

        function openLastReadable(){
            $scope.sortByLastEdit();
            var firstNoteReadable;
            for (var i = 0; i < $scope.localStoredNotes.length; i++){
                //console.log("Vediamo un po");
                //console.log($scope.localStoredNotes[i]);
                if (!$scope.localStoredNotes[i].doc.trashed){
                    firstNoteReadable = $scope.localStoredNotes[i];
                    break;
                }
            }
            $scope.currentNote = firstNoteReadable;
            updateComparing();
            $scope.open($scope.currentNote);
        }

        $scope.dio = function (n) {
            alert(n ? n : "Dio");
        }

        $interval(function () {
            //console.log($('.selectCategories').val());
            //console.log("Mio padre mi ha insegnato a salvare da solo:")
            //console.log(TrafficLightService.busy() + " " + noteOnQueue);
            if (!autoSaveEnabled) return;
            if (TrafficLightService.busy()) $scope.footerMessage =  "Solo un momento... c.c ";
            //console.log("Sono diverso... o sono gli altri ad esserlo?");
            //console.log(hasBeenEdited());
            if (TrafficLightService.busy() || $scope.currentNote == undefined || !hasBeenEdited()) return;
            console.log("Autosalvataggio");
            TrafficLightService.addLight("Autosave");
            backEdit(function (err, data) {
                TrafficLightService.removeLight("Autosave");
                updateComparing();
                $scope.footerMessage =  "Modifiche salvate ^.^ ";
                if (noteOnQueue != undefined){
                    $scope.open(noteOnQueue);
                    noteOnQueue = undefined;
                }
            }, true)
        }, 1000);

        function hasBeenEdited() {
            return $scope.text != comparingText ||
                    $scope.title != comparingTitle
                || !areArraysEquals($('.selectCategories').val(), comparingTags);
        }

        $scope.hasBeenEdited = function(){
            return hasBeenEdited();
        }

        $scope.isBusy = function(){
            return TrafficLightService.busy();
        }

        function updateComparing() {
            comparingText = $scope.text;
            comparingTitle = $scope.title;
            comparingTags = $('.selectCategories').val()
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

        $scope.previewText = function(x, limit){
            return removeTags(x.substring(0, x.length > limit ? limit : x.length) + (x.length > limit ? "..." : ""));
        }

        function removeTags(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }

        function areArraysEquals(a1, a2){
            if (a1 == null && a2 == null) return true;
            if (a1 == null ^ a2 == null) return false;
            //if (a1 != null ? a1.length : 0 != a2 != null ? a2.length : 0) return false;
            for (var i = 0; i < a1.length; i++){
                if (a1[i] != a2[i]) return false;
            }
            return true;
        }

        function initSelect2(){
            $('.selectCategories').select2({
                tags: true,
                tokenSeparators: [',', ' '],
                placeholder: "Categoria...",
                minimumResultsForSearch: Infinity,
                allowClear: true
            });
            $('.insertCategories').select2({
                tags: true,
                tokenSeparators: [',', ' '],
                maximumSelectionLength: 2,
                placeholder: "Categorie...",
                minimumResultsForSearch: Infinity
            });

            console.log("Jquery merda");
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

        $scope.tagFilter = function(x){
            var tagsToSearch = $('.insertCategories').val();
            //console.log("Ma scusate eh");
            //console.log(tagsToSearch);
            if (tagsToSearch == null) return true;
            var tags = x.doc.tags;
            //console.log("Confronto con ");
            //console.log("I tag invece sono");
            //console.log(tags);
            if (tags == null || tags == undefined) return false;
            for (var i = 0; i < tags.length; i++){
                for (var y = 0; y < tagsToSearch.length; y++){
                    //console.log(tags[i] + " e' uguale a " + tagsToSearch[i]);
                    if (tags[i] == tagsToSearch[y]) return true;
                }
            }
            return false;
        }

        $scope.searchAndTagFilter = function(x){
            if (x.doc.trashed) return false;
            if ($scope.searchText == undefined) return true;
            var title = x.doc.title.toLowerCase();
            var content = x.doc.content.toLowerCase();
            var tags = x.doc.tags;
            //tags = tags != null ? tags.forEach(function(x){x.toLowerCase()}) : [];
            var toSearch = $scope.searchText.toLowerCase();
            /*var check1 = title.includes(toSearch);
            var check2 = content.includes(toSearch);
            var check3 = tags.filter(function(x){
                    return x.includes(toSearch);
                }).length > 0;
            console.log(title + " " + check1 + " " + check2 + " " + check3);
            return check1 || check2 || check3;      //TODO si si lo so*/
            return title.includes(toSearch) ||
                content.includes(toSearch) ||
                (tags != undefined && tags.filter(function(x){
                    return x.includes(toSearch);
                }).length > 0);
        }

        $scope.checkBoxPressed = function(action, x){
            if (action) $scope.addToRestoring(x);
            else $scope.removeToRestoring(x);
        }

        $scope.trashedFilter = function(x){
            return x.doc.trashed;
        }

        $scope.addToRestoring = function(x){
            console.log(x.doc.title + " aggiunto al ripristino");
            noteToRestore.push(x);
        }

        $scope.removeToRestoring = function(x){
            console.log(x.doc.title + " rimosso dal ripristino");
            for (var i = 0; i < noteToRestore.length; i++){
                if (noteToRestore[i].doc._id == x.doc._id){
                    noteToRestore.splice(i, 1);
                    return;
                }
            }
        }


        $scope.downloadNote = function(){
            $scope.downloadedNote = false;
            $scope.downloading = true;
            html2canvas(document.getElementsByClassName("blockNotePreview"), {
                onrendered: function(canvas) {
                    var image = canvas.toDataURL("image/png");
                    document.getElementById("downloadLink").href = image;
                    $scope.downloadedNote = true;
                    $scope.downloading = false;
                },
                useCORS: true
            });
        }

        function isInRestoring(x){
            for (var i = 0; i < noteToRestore.length; i++){
                //console.log("Confronto");
                //console.log(noteToRestore[i].doc._id);
                //console.log(x._id);
                if (noteToRestore[i].doc._id == x._id) {
                    console.log("Sto per restorare " + x.title);
                    return true;
                }
            }
            return false;
        }

        $scope.isRestoringEmpty = function(){
            return noteToRestore.length == 0;
        }

        $scope.stripFormat = function ($html) {
            return $filter('htmlToPlaintext')($html.replace(/<[^>]+>/gm, ''));
        };

        function notifyError(err){
            $scope.footerMessage = "Ops la nota non e' stata modificata o.o";
            console.error(err);
        }

        $scope.randomColor = function(){
            var r = (255*Math.random()) | 0,
             g = (255*Math.random()) | 0,
             b = (255*Math.random()) | 0;
             return 'rgb(' + r + ',' + g + ',' + b + ')';
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
               $('.logoCentered, .sectionNotes, #addMobile, #editMobile, .sidebarElement').click(function () {
               $('.sidebar-offcanvas').removeClass('active', 1000);
           });

               $(":file").filestyle({ buttonBefore: true });

               $('select').select2({ width: 'resolve' });
        });

        init();

    });
