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

    this.animateAddButton = function (argu) {
        console.log("Edit " + getCheckEdit() + " Add: " + getCheckAdd());
        if (getCheckEdit() || getCheckAdd()) return;
        setCheckAdd(true);
        if (argu != undefined) setShowing(false);
        $('[data-toggle="tooltip"]').tooltip();
        $("#addFeatures").attr("data-toggle", "tooltip");
        $("#addFeatures").attr("title", "Crea nota");
        $("#addFeatures").addClass("hidden-xs hidden-sm");

        $(".out").hide(300);
        $("#preview1").css("display","none");
        $(".asideNotes").addClass("asidev2");
        $(".editArea").css("display", "block");
        $(".blockNoteContainer").css("display", "none");

        setTimeout(function () {
            $(".imageFirstNode").css("display", "none");
            //$("#testMobile").css("display", "none");
            $(".divEditor").css("display", "block");
            $(".divEditor").addClass("animated fadeIn");
            $(".no-display").css("display", "block");
            $(".no-display").addClass("hvr-box-shadow-inset animated rotateIn");
            $(".no-text").css("display", "block");
            $(".no-text").addClass("animated bounceInRight");
            $(".no-show").css("display", "block");
            $("#sidebarIcon").addClass("visible-xs visible-sm");
            $(".editArea").css("display", "block");
            //$(".blockNoteContainer").addClass("animated bounceInRight");
            console.log("Adesso checkAdd diventera' false!");
            setCheckAdd(false);
        }, 600, this.checkEdit, this.checkAdd, this.showing);
    }

    this.animateEditButton = function (argu) {
        console.log("Edit " + getCheckEdit() + " Add: " + getCheckAdd());

        if (getCheckEdit() || getCheckAdd()) return;
        if (argu == undefined ? getShowing() : true){
            setShowing(false);
        }
        else {
            setShowing(true);
            this.backToAdd();
            return;
        }
        setCheckEdit(true);

        $(".blockNoteContainer").addClass("animated bounceOutRight");

        setTimeout(function () {
            $(".blockNoteContainer").css("display", "none");
            $(".editArea").stop().css("display", "block");
            console.log("Adesso checkEdit diventera' false");
            $(".blockNoteContainer").removeClass("animated bounceOutRight");
            setCheckEdit(false);
        }, 400, this.checkEdit, this.checkAdd);

    }

    this.backToAdd = function () { // NON QUI, sai cosa tu chiami questa funzione
        console.log("Edit " + getCheckEdit() + " Add: " + getCheckAdd());

        if (getCheckEdit() || getCheckAdd()) return;
        setCheckEdit(true);
        
        $(".editArea").addClass("animated bounceOutRight");
       
        setTimeout(function () {
            $(".editArea").css("display","none");
            $(".blockNoteContainer").addClass("animated bounceInRight");
            $(".blockNoteContainer").css("display", "block");
            console.log("Adesso checkEdit diventera' false");
            $(".editArea").removeClass("animated bounceOutRight");
            setCheckEdit(false);
        }, 400);

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

    function getCheckAdd() {
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
        setShowing(false);
        this.animateEditButton();
        /*$("#preview1, #preview2, #preview3").css("position", "absolute");
        $("#preview1, #preview2, #preview3").css("display", "none");*/
        $("#preview1, #preview2, #preview3").css("margin-left", "-999px");

        $('[data-toggle="tooltip"]').tooltip();
        $("#addFeatures").attr("data-toggle", "tooltip");
        $("#addFeatures").attr("title", "Crea nota");
        $("#addFeatures").addClass("hidden-xs hidden-sm");

        $(".asideNotes").addClass("asidev2");

        $(".fullPageNotes").css("display", "block");
       
            $(".divEditor").css("display", "block");
            $(".divEditor").addClass("animated fadeIn");
            $(".no-display").css("display", "block");
            $(".no-display").addClass("hvr-box-shadow-inset animated rotateIn");
            $(".no-text").css("display", "block");
            $(".no-text").addClass("animated bounceInRight");
            $(".no-show").css("display", "block");
            $("#sidebarIcon").addClass("visible-xs visible-sm");
            $(".editArea").css("display", "none");
            $(".blockNoteContainer").addClass("animated bounceInRight");
            $(".blockNoteContainer").css("display", "block");
        
    }

    this.isFirstTouch = function () {
        setShowing(false);
        $(".fullPageNotes").css("display", "block");
        $(".fullPageNotes").fadeIn(500);
        
    }

});