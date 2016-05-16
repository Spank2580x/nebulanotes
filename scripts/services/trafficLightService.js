/**
 * Created by Luca on 14/05/2016.
 */
routerApp.service('TrafficLightService', function() {

    this.lights;

    this.init = function(){
        this.lights = [];
    }

    this.busy = function(){
        return this.lights.length > 0;
    }

    this.addLight = function(property){
        this.lights.push(property);
    }

    this.removeLight = function(property){
        for (var i = 0; i < this.lights.length; i++){
            if (this.lights[i] == property) {
                this.lights.splice(i, 1);
                return;
            }
        }
        console.error("Non ce nessun " + property);
    }

    this.getAllLights = function(){
        return this.lights;
    }

});