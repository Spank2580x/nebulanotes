/**
 * Created by Luca on 14/05/2016.
 */
routerApp.service('AnimationService', function() {

    this.animateAddButton = function(){
        $(".out").hide(300);
        $("#preview1, #preview2, #preview3").hide(1);
        $(".asideNotes").addClass("asidev2");
        $(".blockNote").css("display", "block");
        $(".blockNote").addClass("animated bounceInLeft");
        $("#addFeatures").removeClass("animated infinite bounce");
        setTimeout(function () {
            $(".divEditor").css("display", "block");
            $(".divEditor").addClass("animated fadeIn");
            $(".no-display").css("display", "block");
            $(".no-display").addClass("hvr-box-shadow-inset animated rotateIn");
            $(".no-text").css("display", "block");
            $(".no-text").addClass("animated bounceInRight");
            $(".no-show").css("display", "block");
        }, 600);
    }


});