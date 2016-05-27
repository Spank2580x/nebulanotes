/**
 * Created by Luca on 14/05/2016.
 */
routerApp.service('TrafficLightService', function() {

    this.enabled;
    this.lights;

    this.init = function(enable){
        this.lights = [];
        this.enabled = enable;
    }

    this.busy = function(){
        return this.enabled && this.lights.length > 0;
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