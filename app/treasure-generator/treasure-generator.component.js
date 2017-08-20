'use strict';

angular.module('treasureGenerator').

component('treasureGenerator', {
  templateUrl: 'treasure-generator/treasure-generator.template.html',
  controller: 'TreasureGeneratorController'
}).

controller('TreasureGeneratorController', ['LootTable', function(LootTable) {
  var self = this;
  self.tables = LootTable.query();
  self.selectedTable = {};
  self.treasures = [];

  self.startGeneration = function() {
    self.treasures = [];
    if (self.selectedTable) {
      self.generateTreasure(self.selectedTable.id);
    }
  };

  self.generateTreasure = function(lootTableId) {
    var loot = LootTable.get({lootTableId: lootTableId}, self.pickTreasure);
  }

  self.pickTreasure = function(lootTable) {
    //console.log(lootTable);
    /* TODO Split evanuation logic into separate service. */

    if (lootTable) {
      if (lootTable.staticLoot) {
        for (var lootIndex in lootTable.staticLoot) {
          var loot = lootTable.staticLoot[lootIndex];
          if (loot.type == "item" && loot.id != "nothing") {
            loot.amount = self.evaluateAmount(loot.amount);

            var duplicate = false;
            for (var treasureIndex in self.treasures) {
              if (loot.id == self.treasures[treasureIndex].id) {
                self.treasures[treasureIndex].amount += loot.amount;
                duplicate = true;
              }
            }

            if (!duplicate) {
              self.treasures.push(loot);
            }

          } else if (loot.type == "table") {
            for (var i = 0; i < self.evaluateAmount(loot.amount); i ++) {
              self.generateTreasure(loot.id);
            }
          }
        }
      }

      if (lootTable.randomLoot) {
        for (var lootRollIndex in lootTable.randomLoot) {
          //console.log(lootTable.randomLoot[lootRollIndex]);
          var lootList = lootTable[lootTable.randomLoot[lootRollIndex]];
          //console.log(lootList);

          var loot = lootList[Math.floor(Math.random() * lootList.length)];

          if (loot.type == "item" && loot.id != "nothing") {
            loot.amount = self.evaluateAmount(loot.amount);

            var duplicate = false;
            for (var treasureIndex in self.treasures) {
              if (loot.id == self.treasures[treasureIndex].id) {
                self.treasures[treasureIndex].amount += loot.amount;
                duplicate = true;
              }
            }

            if (!duplicate) {
              self.treasures.push(loot);
            }

          } else if (loot.type == "table") {
            for (var i = 0; i < self.evaluateAmount(loot.amount); i ++) {
              self.generateTreasure(loot.id);
            }
          }
        }
      }

    }
  };

  self.evaluateAmount = function(amountEquation) {
    if (angular.isNumber(amountEquation)) {
      return amountEquation;
    }

    var tokenPrecedence = [];
    tokenPrecedence["+"] = 2;
    tokenPrecedence["-"] = 2;
    tokenPrecedence["x"] = 3;
    tokenPrecedence["*"] = 3;
    tokenPrecedence["/"] = 3;
    tokenPrecedence["d"] = 4;
    tokenPrecedence["("] = 5;

    var values = [];
    var operators = [];
    var numberRun = false;
    var tokenStart = 0;
    var digitRe = /\d+/;

    // Convert string into tokens
    var tokens = amountEquation.split(" ");

    for (var tokenIndex in tokens) {
      var token = tokens[tokenIndex];

      if (token.match(digitRe)) {
        //console.log("Pushing " + token + " to values stack");
        values.push(parseInt(token));
      } else if (token == "(") {
        //console.log("Pushing " + token + " to operators stack");
        operators.push(token);
      } else if (token == ")") {
        //console.log("Looking for )");
        while (operators[operators.length - 1] != "(") {
          var op = operators.pop();
          var left = values.pop();
          var right = values.pop();

          var value = self.evaluateOperation(op, left, right);
          //console.log("Pushing " + value + " to values stack");
          values.push(value);
        }
        operators.pop();
      } else {
        var precedence = tokenPrecedence[token];
        //console.log("Looking for precedence");
        while (operators.length > 0 && tokenPrecedence[operators[operators.length - 1]] >= precedence) {
          var op = operators.pop();
          var left = values.pop();
          var right = values.pop();

          var value = self.evaluateOperation(op, left, right);
          //console.log("Pushing " + value + " to values stack");
          values.push(value);
        }

        //console.log("Pushing " + token + " to operators stack");
        operators.push(token);
      }
    }

    //
    while (operators.length > 0) {
      var op = operators.pop();
      var left = values.pop();
      var right = values.pop();

      values.push(self.evaluateOperation(op, left, right));
    }

    return values[0];
  }

  self.evaluateOperation = function (operation, left, right) {
    //console.log(left + " " + operation + " " + right);
    var result;
    if (operation == "+") {
      //console.log("+");
      result = right + left;
    } else if (operation == "-") {
      //console.log("-");
      result = right - left;
    } else if (operation == "x" || operation == "*") {
      //console.log("x");
      result = right * left;
    } else if (operation == "/") {
      //console.log("/");
      result = right / left;
    } else if (operation == "d") {
      //console.log("d");
      result = Math.floor(Math.random() * (right * left - right) + right);
    }

    return result;
  }
}]);
