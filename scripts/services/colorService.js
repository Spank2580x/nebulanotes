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
            "rgb(179,190,255)",
            "rgb(205,179,255)",
            "rgb(117,138,255)",
            "rgb(222,204,255)",
            "rgb(143,160,255)"
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