app.factory('BlackjackService', ['$deck', '$storage', function ($deck, $storage) {
    "use strict";
    var factory = {};
    
    factory.soft = false;
    
    factory.weight = function (hand) {
        var i = 0,
            value = 0,
            temp = 0;
        for (i = 0; i < hand.length; i += 1) {
            temp = hand[i].rank;
            if (temp >= 10 && temp <= 13) {
                value += 10;
            } else if (temp < 10) {
                value += temp;
            } else if (value <= 10 && temp === 14) {
                value += 11;
                factory.soft = true;
            } else if (value > 10 && temp === 14) {
                value += 1;
            } else {
                // error logging
                console.log("Weight Error: rank " + temp + ", val " + value);
            }
            // check for soft "busts"
            if (value > 21 && factory.soft) {
                factory.soft = false;
                value -= 10;
            }
        }
        return value;
    }
    
    return factory;
}]);