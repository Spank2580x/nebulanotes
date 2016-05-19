/**
 * Created by Luca on 14/05/2016.
 */
routerApp.service('AnimationService', function () {

    this.animateAddButton = function () {
        $('[data-toggle="tooltip"]').tooltip();
        $("#addFeatures").attr("data-toggle", "tooltip");
        $("#addFeatures").attr("title", "Crea nota");
        $("#addFeatures").addClass("hidden-xs hidden-sm");

        $(".out").hide(300);
        $("#preview1, #preview2, #preview3").hide(1);
        $(".asideNotes").addClass("asidev2");
        /*$(".blockNote").css("display", "block");
        $(".blockNote").addClass("animated bounceInLeft");*/
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
        }, 600);
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