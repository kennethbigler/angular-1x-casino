/*global $, console, app, $scope */

app.controller('CrapsController', ['$scope', '$deck', 'CrapsService', function ($scope, $deck, CrapsService) {
    "use strict";
    // place bets
    // roll dice
    // evaluate
    $scope.d1 = 0;
    $scope.d2 = 0;
    
    $scope.spin = function () {
        var d1 = Math.floor(Math.random() * 6) + 1,
            d2 = Math.floor(Math.random() * 6) + 1;
        $scope.d1 = d1;
        $scope.d2 = d2;
    };
    
    $scope.spin();
}]);

/* Casino Craps (or Bank Craps)

To begin, the Shooter must bet at least the table minimum on either Pass or Don't Pass Line

shooter must handle dice with one hand only when throwing and dice must hit the walls on the opposite end of the table
craps table <= 20 players, each get a chance at 'shooting' the dice, moving clockwise around the table at end of each round
failing to make Point or makes a Seven-out moves to next shooter
casino crew consists of: Stickman, Boxman, 2 Dealers

Each round has two phases: Come Out and Point:
    To start, the shooter makes 1+ Come Out rolls:
        Come Out roll of 2 / 3 / 12 (Craps, shooter said to 'crap out'): ends round, Pass Line bets lose
        Come Out roll of 2 / 3: Don't bets win
        Come Out roll of 12 (Bar roll): Don't bets tie
        Come Out roll of 7 / 11 (Natural): Pass Line bets win, Don't Bet's lose
    Shooter continues Come Out rolls until he rolls 4, 5, 6, 8, 9, or 10 (that num becomes Point)
    Dealer moves On button to the point number, signifies second phase
        If shooter rolls Point num: Pass Line bets win, Don't Pass loses
        If shooter rolls a 7 (a Seven-out): pass line loses, Don't Pass wins, and round ends

If Point number is Off - table is in Come Out round
If dealer's button is 'On' - table is in the Point round, Pass Line bets can be placed
All single or multi roll 'Proposition bets' can be made in both rounds

dealer makes payouts and collects losing bets after each roll, then players can place new bets
stickman monitors action at the table and decides when to give the shooter the dice, after which no more betting is allowed

Pass Line win pays 1:1
Place Bets: after a point is rolled you can make this additional bet by taking odds
    4 or 10 pays 2:1
    5 or 9  pays 3:2
    6 or 8  pays 6:5
    You only win if the point is rolled again before a 7
    You can cancel this bet anytime you want to.

Come Bet:
Same rules as the Pass Line Bet
The difference is you place this bet only after Point has been determined
On a Come Out roll, Come Bet is placed on the pass line as they are an identical bet, the first point number that 'comes' from the shooter's next roll, regardless of the table's round
After you place your bet the first dice roll will set the come point
You win if it is a natural (7, 11)
and lose if it is craps (2, 3, 12)
Other rolls will make you a winner if the come point is repeated before a 7 is rolled
This number becomes the Come Bet point and the player is allowed to add odds to the bet
If a 7 is rolled first you lose

Because of the Come Bet, if the shooter makes their point, a player can find themselves in the situation where they have a Come Bet (possibly with odds on it)
and the next roll is a Come Out roll
In this situation odds bets on the come wagers are presumed to be not working for the Come Out roll
if the shooter rolls a 7 on the Come Out roll, any players with active Come Bets waiting for a 'come point' lose their initial wager but will have their odds money returned to them
If the 'come point' is rolled the odds do not win but the Come Bet does and the odds are returned
Player can tell Dealer that they want their odds working, such that if Shooter rolls a number that matches 'come point', odds bet will win along with Come Bet, and if 7 is rolled both lose

Odds on Come Bet:
Exactly the same thing as the Odds on Pass Line Bet except you take odds on the Come Bet not the Pass Line Bet

Don't Come Bet:
The reversed Come Bet
After the come point has been established you win if it is a 2 or 3 and lose for 7 or 11
12 is a tie and other dice rolls will make you win only if a 7 appears before them on the following throws

Field Bets:
These bets are for one dice roll only
If a 2, 3, 4, 9, 10, 11, 12 is rolled you win
A 5, 6, 7 and 8 make you lose
    2 pays 2:1
    12 pays 3:1
    All else pays 1:1

Big Six, Big Eight Bets:
Placed at any roll of dice, 6 or 8 wins, 7 loses, pays 1:1

Proposition Bets:
These bets can be made at any time and, except for the hardways, they are all one roll bets:
    Any Craps: Wins if a 2, 3 or 12 is thrown. Payoff 8:1
    Any Seven: Wins if a 7 is rolled. Payoff 5:1
    Eleven: Wins if a 11 is thrown. Payoff 16:1
    Ace Duece: Wins if a 3 is rolled. Payoff 16:1
    Aces or Boxcars: Wins if a 2 or 12 is thrown. Payoff 30:1

Horn Bet:
it acts as the bets on 2, 3, 11 and 12 all at once
Wins if one of these numbers is rolled
Payoff is determined according to the number rolled
The other three bets are lost

Hardways:
The bet on a hardway number wins if it's thrown hard (sum of pairs: 1-1, 3-3, 4-4...) before it's rolled easy and a 7 is thrown
Payoffs: Hard 4 and 10, 8:1; Hard 6 and 8, 10:1

House advantage: 2 - 17%
*/