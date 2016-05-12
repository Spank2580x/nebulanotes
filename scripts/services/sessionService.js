/**
 * Created by Luca on 20/04/2016.
 */
routerApp.service('SessionService', function($sessionStorage){

    function checkValidSession(currentSession){
        return $sessionStorage.jesseSession == currentSession;
    }

    this.allowSession = function(currentSession){
        console.log("Check sessione" + " " + $sessionStorage.jesseSession + " " + currentSession);
        if (!checkValidSession(currentSession)){
            alert("Sessione scaduta, ritornerai alla pagina di login");
            //$state.go('login');
            return false;
        }
        return true;
    }

    this.destroySession = function(){
        $sessionStorage.jesseSession = -1;
        return true;
        //$state.go('login');
    }

    this.storeSession = function(currentSession){
        $sessionStorage.jesseSession = currentSession;
    }

});