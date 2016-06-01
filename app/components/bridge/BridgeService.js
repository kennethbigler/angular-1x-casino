/*global app*/
app.factory('BridgeService', ['$log', '$deck', function ($log, $deck) {
    "use strict";
    var factory = {};
    
    factory.deal = function () {
        var i, hands = [];
        $deck.shuffle();
        for (i = 0; i < 4; i += 1) {
            hands[i] = $deck.deal(13);
            hands[i].sort($deck.suitSort);
        }
        return hands;
    };

    return factory;
}]);