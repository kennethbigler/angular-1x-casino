/*global app*/

app.factory('BlackjackService', ['$deck', '$storage', '$log', function ($deck, $storage, $log) {
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
                $log.error("Weight Error: rank " + temp + ", val " + value);
            }
            // check for soft "busts"
            if (value > 21 && factory.soft) {
                factory.soft = false;
                value -= 10;
            }
        }
        return value;
    };
    
    factory.add = function (n, p) {
        return $storage.add(n, p);
    };
    
    factory.sub = function (n, p) {
        return $storage.sub(n, p);
    };
    
    factory.deal = function (num) {
        return $deck.deal(num);
    };
    
    factory.shuffle = function () {
        $deck.shuffle();
        return;
    };
    
    factory.rankSort = $deck.rankSort;
    
    return factory;
}]);