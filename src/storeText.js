define(['constants'], function(constants) {
    var StoreText = function(game, x, y, name, price, currency) {
        var style = {
            font: '25px PT Sans'
            , fill: 'AAA'
        };
        Phaser.Text.call(this, game, x, y, '', style);
        this.name = name;
        this.price = price;
        this.currency = currency;

        this.inputEnabled = true;
        this.events.onInputDown.add(this.clicked, this);
    }

    StoreText.prototype = Object.create(Phaser.Text.prototype);
    StoreText.prototype.constructor = StoreText;

    StoreText.prototype.setScore = function(score) {
        this.score = score;
    };

    StoreText.prototype.update = function() {
        if (this.game.score[this.currency] > this.price) {
            this.fill = "FFF";
        } else {
            this.fill = "AAA";
        }
    };

    StoreText.prototype.clicked = function() {
        if (this.game.score[this.currency] > this.price) {
            this.game.buy(this, this.name);
        }
    };

    return StoreText;
})