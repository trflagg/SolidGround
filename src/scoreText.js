define([], function() {
    var ScoreText = function(game, x, y, name, style) {
        Phaser.Text.call(this, game, x, y, '', style);
        this.name = name;
        this.score = 0;
    }

    ScoreText.prototype = Object.create(Phaser.Text.prototype);
    ScoreText.prototype.constructor = ScoreText;

    ScoreText.prototype.setScore = function(score) {
        this.score = score;
    };

    ScoreText.prototype.update = function() {
        var text = this.name + " " + this.score;
        if (this.max) {
            text += " / " + this.max;
        }
        if (this.rate) {
            text += " * $" + this.rate;
        }
        this.text = text;
        this.x = this.game.world.width - this._width;
    };
    return ScoreText;
})