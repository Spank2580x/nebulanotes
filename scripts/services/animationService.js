/**
 * Created by Luca on 14/05/2016.
 */
routerApp.service('AnimationService', function () {

    this.checkAdd;
    this.checkEdit;
    this.showing;

    this.init = function () {
        setCheckAdd(false);
        setCheckEdit(false);
        setShowing(true);
    }

    this.animateAddButton = function () {
        console.log("Edit " + getCheckEdit() + " Add: " + getCheckAdd());
        if (getCheckEdit() || getCheckAdd()) return;
        setCheckAdd(true);
        setShowing(true);
        $('[data-toggle="tooltip"]').tooltip();
        $("#addFeatures").attr("data-toggle", "tooltip");
        $("#addFeatures").attr("title", "Crea nota");
        $("#addFeatures").addClass("hidden-xs hidden-sm");

        $(".out").hide(300);
        $("#preview1, #preview2, #preview3").hide(1);
        $(".asideNotes").addClass("asidev2");
        $(".editArea").css("display", "none");
        $(".blockNoteContainer").removeClass("animated bounceOutRight");
        $("#addFeatures").removeClass("animated infinite bounce");
        setTimeout(function () {
            $(".divEditor").css("display", "block");
            $(".divEditor").addClass("animated fadeIn");
            $(".no-display").css("display", "block");
            $(".no-display").addClass("hvr-box-shadow-inset animated rotateIn");
            $(".no-text").css("display", "block");
            $(".no-text").addClass("animated bounceInRight");
            $(".no-show").css("display", "block");
            $("#sidebarIcon").addClass("visible-xs visible-sm");
            $(".blockNoteContainer").addClass("animated bounceInRight");
            console.log("Adesso checkAdd diventera' false!");
            setCheckAdd(false);
        }, 600, this.checkEdit, this.checkAdd, this.showing);
    }

    this.animateEditButton = function () {
        console.log("Edit " + getCheckEdit() + " Add: " + getCheckAdd());

        if (getCheckEdit() || getCheckAdd()) return;
        if (getShowing()){
            setShowing(false);
        }
        else {
            setShowing(true);
            this.backToAdd();
            return;
        }
        setCheckEdit(true);

        $(".blockNoteContainer").stop().addClass("animated bounceOutRight");

        setTimeout(function () {
            $(".blockNoteContainer").css("display", "none");
            $(".editArea").stop().css("display", "block");
            console.log("Adesso checkEdit diventera' false");
            setCheckEdit(false);
        }, 500, this.checkEdit, this.checkAdd);

    }

    this.backToAdd = function () {
        console.log("Edit " + getCheckEdit() + " Add: " + getCheckAdd());

        if (getCheckEdit() || getCheckAdd()) return;
        setCheckEdit(true);
        $(".editArea").removeClass("animated bounceInRight");
        $(".editArea").addClass("animated bounceOutRight"); // se non fa l'animazione chiedi a raggio , aggiungi il removeclass
        $(".editArea").css("display", "none");

        setTimeout(function () {
            $(".blockNoteContainer").css("display", "normal");
            $(".blockNoteContainer").addClass("animated bounceInRight");
            console.log("Adesso checkEdit diventera' false");
            setCheckEdit(false);
        }, 500);

    }

    function setCheckEdit(b) {
        this.checkEdit = b;
    }

    function getCheckEdit() {
        return this.checkEdit;
    }

    function setCheckAdd(b) {
        this.checkAdd = b;
    }

    function getCheckAdd(b) {
        return this.checkAdd;
    }

    function setShowing(b) {
        this.showing = b;
    }

    function getShowing() {
        return this.showing;
    }


    this.animateBlack = function () {
        $(".blockNote:nth-child(1)").addClass("black");
        $(".blockNote:nth-child(1)").css("color", "white");
    }

    this.animateRed = function () {
        $(".blockNote:nth-child(1)").addClass("red");
        $(".blockNote:nth-child(1)").css("color", "black");
    }

    this.checkFirstTouch = function () {
        /*$(".out").css("position", "absolute");
        $(".out").css("margin-left", "-999px");*/
        $(".out").css("display", "none");

        /*$("#preview1, #preview2, #preview3").css("position", "absolute");
        $("#preview1, #preview2, #preview3").css("display", "none");*/
        $("#preview1, #preview2, #preview3").css("margin-left", "-999px");

        $('[data-toggle="tooltip"]').tooltip();
        $("#addFeatures").attr("data-toggle", "tooltip");
        $("#addFeatures").attr("title", "Crea nota");
        $("#addFeatures").addClass("hidden-xs hidden-sm");

        $(".asideNotes").addClass("asidev2");

        $(".fullPageNotes").css("display", "block");
        $(".fullPageNotes").fadeIn(500);
        setTimeout(function () {
            $(".divEditor").css("display", "block");
            $(".divEditor").addClass("animated fadeIn");
            $(".no-display").css("display", "block");
            $(".no-display").addClass("hvr-box-shadow-inset animated rotateIn");
            $(".no-text").css("display", "block");
            $(".no-text").addClass("animated bounceInRight");
            $(".no-show").css("display", "block");
            $("#sidebarIcon").addClass("visible-xs visible-sm");
        }, 1);
    }

    this.isFirstTouch = function () {
        $(".fullPageNotes").css("display", "block");
        $(".fullPageNotes").fadeIn(500);
    }

});