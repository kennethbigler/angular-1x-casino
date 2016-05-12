/*global app */

app.controller('SolitaireController', ['$scope', '$deck', 'SolitaireService', '$log', function ($scope, $deck, SolitaireService, $log) {
    "use strict";
    $deck.shuffle();
    var board = {
        "p1": $deck.deal(1),
        "p2": $deck.deal(1),
        "p3": $deck.deal(2),
        "p4": $deck.deal(3),
        "p5": $deck.deal(4),
        "p6": $deck.deal(5),
        "p7": $deck.deal(6),
        "p8": [[]],
        "p9": [[]],
        "p10": [[]],
        "p11": [[]],
        "deck": $deck.deal(24),
        "discard": []
    }, i, pos;
    for (i = 2; i <= 7; i += 1) {
        pos = "p" + i;
        board[pos].push($deck.deal(1));
    }
    $scope.board = board;
    $log.log($scope.board);


    $scope.play = function (num, num2) {
        var tcard, pos, x, place, len, endp;
        pos = "p" + num;
        // function is called and card is selected
        tcard = $scope.board[pos].pop();
        // highlight locations where this card can go
        
        // selected location moved to backend
        x = "p" + "new location";
        // check to see if the card is allowed to go there
        place = $scope.board[x].pop();
        len = place.length - 1;
        if (len === -1) {
            endp = (place === "p8" || place === "p9" || place === "p10" || place === "p11");
            if ((endp && tcard.rank === 14) || tcard.rank === 13) {
                place.push(tcard);
            }
        } else if (tcard.rank === place[len].rank - 1) {
            //move card to the new position
            $log.log("Hello world");
        }
    };
}]);