define([], function() {
    var ScoreText = function(game, x, y, name, style) {
        Phaser.Text.call(this, game, x, y, '', style);
        console.log(y);
        console.log(this.y);
        this.name = name;
        this.score = 0;
    }

    ScoreText.prototype = Object.create(Phaser.Text.prototype);
    ScoreText.prototype.constructor = ScoreText;

    ScoreText.prototype.setScore = function(score) {
        this.score = score;
    };

    ScoreText.prototype.update = function() {
        this.text = this.name + " " + this.score;
        this.x = this.game.world.width - this._width;
    };
    return ScoreText;
})