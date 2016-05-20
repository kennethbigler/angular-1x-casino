/*global app */

app.controller('SolitaireController', ['$scope', 'SolitaireService', '$log', function ($scope, $SS, $log) {
    "use strict";
    
    $scope.board = $SS.board;
    $log.log($scope.board);

    $scope.play = function (from, to, i) {
        var cardArray = [],
            place = {};
        // card selected and below cards are "grabbed"
        cardArray = $scope.board[from].splice(i, ($scope.board[from].length - i - 1));
        // highlight these as moving, or make them moveable
        
        // check to see if the card is allowed to go there
        place = $scope.board[to][$scope.board[to].length - 1];
        if (place) {
            (tcard.rank === place[len].rank - 1);
            //move card to the new position
            $log.log("Hello world");
        } else if (!place) {
            if (((to === "end1" || to === "end2" || to === "end3" || to === "end4") && tcard.rank === 14) || tcard.rank === 13) {
                $scope.board[to].concat(cardArray);
            }
        }
    };
}]);