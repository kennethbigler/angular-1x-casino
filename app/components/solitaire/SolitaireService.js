/*global app*/
app.factory('SolitaireService', ['$deck', '$log', function ($deck, $log) {
    "use strict";
    var factory = {};
    
    $deck.shuffle();
    factory.board = {
        "p1": $deck.deal(1), //[{}]
        "p2": $deck.deal(2), //[{},{}]
        "p3": $deck.deal(3),
        "p4": $deck.deal(4),
        "p5": $deck.deal(5),
        "p6": $deck.deal(6),
        "p7": $deck.deal(7),
        "end1": [[]],
        "end2": [[]],
        "end3": [[]],
        "end4": [[]],
        "deck": $deck.deal(26),
        "discard": []
    };

    return factory;
}]);