/**
 * Created by Luca on 18/05/2016.
 */
routerApp.service('ColorService', function() {

    this.getRandomColor = function() {
        /*var r = (255*Math.random()) | 0,
            g = (255*Math.random()) | 0,
            b = (255*Math.random()) | 0;
        return 'rgb(' + r + ',' + g + ',' + b + ')';*/
        var colors = [
            "rgb(204,212,205)",
            "rgb(122,217,176)",
            "rgb(121,170,149)",
            "rgb(152,213,187)",
            "rgb(203,234,221)",
            "rgb(214,229,223)"
        ];
        var c = parseInt(Math.random() * colors.length);
        console.log(colors[c]);
        return colors[c];
    }

    this.getRGBFromColor = function(color){
        var split = color.split(",");
        var r = parseInt(split[0].substr(4));
        var g = parseInt(split[1]);
        var b = parseInt(split[2].substring(0, split[2].length - 1));
        return [r, g, b];
    }

    this.isOpaque = function(color){
        var values = this.getRGBFromColor(color);
        return values[0] + values[1] + values[2] < 366;
    }

});