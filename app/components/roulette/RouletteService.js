/*global app*/
app.factory('RouletteService', ['$deck', function ($deck) {
    "use strict";
    var factory = {};

    factory.spin = function () {
        var r = Math.floor(Math.random() * 38);
        if (r >= 37) {
            r = "00";
        }
        return r;
    };
    
    return factory;
}]);