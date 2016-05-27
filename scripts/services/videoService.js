/**
 * Created by Luca on 26/05/2016.
 */
routerApp.service('VideoService', function () {

    this.init = function(){
        var streaming = false,
            video        = document.querySelector('#video'),
            canvas       = document.querySelector('#canvas'),
            photo        = document.querySelector('#photo'),
            startbutton  = document.querySelector('#startbutton'),
            width = 800,
            height = 600;

        navigator.getMedia = ( navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

        navigator.getMedia(
            {video: true, audio: false},
            function(stream) {
                if (navigator.mozGetUserMedia) {
                    video.mozSrcObject = stream;
                } else {
                    var vendorURL = window.URL || window.webkitURL;
                    video.src = vendorURL.createObjectURL(stream);
                }
                video.play();
            },
            function(err) {
                console.error("Errore cosa?");
                console.error(err);
            }
        );

        video.addEventListener('canplay', function(ev){
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth/width);
                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }
        }, false);

        function takepicture() {
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(video, 0, 0, width, height);
            var data = canvas.toDataURL('image/png');
            //photo.setAttribute('src', data);
        }

        startbutton.addEventListener('click', function(ev){
            takepicture();
            ev.preventDefault();
        }, false);
    }


});