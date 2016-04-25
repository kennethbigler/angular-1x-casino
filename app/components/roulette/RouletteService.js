/*global app*/
app.factory('RouletteService', ['$deck', function ($deck) {
    "use strict";
    var factory = {},
        bets = [
            {items: [], value: 2},
            {items: [], value: 3},
            {items: [], value: 6},
            {items: [], value: 7},
            {items: [], value: 9},
            {items: [], value: 12},
            {items: [], value: 18},
            {items: [], value: 36}
        ];

    factory.spin = function () {
        var r = Math.floor(Math.random() * 38);
        if (r >= 37) {
            r = "00";
        }
        return r;
    };
    
    factory.bet = function (items, bet) {
        var i;
        for (i = 0; i < items.length; i += 1) {
            bets[bet][items[i]] += 1;
        }
    };
    
    return factory;
}]);