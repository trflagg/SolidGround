define(['constants'
        , 'jquery-cookie'], function(constants) {
    var WinState = function() {

    }

    WinState.prototype.init = function(scores) {
        this.scores = scores;
    };
    WinState.prototype.create = function() {

        // check for high scores
        var new_highscore = false;
        var highscore = $.cookie('highscore');
        if (!highscore) {
            highscore = this.scores['time'];
            $.cookie('highscore', this.scores['time']);
            new_highscore = true;
        } else {
            if (this.scores['time'] <= highscore) {
                highscore = this.scores['time'];
                $.cookie('highscore', this.scores['time']);
                new_highscore = true;
            }
        }
        
        this.stage.backgroundColor = "#000";

        var text = new Phaser.Text(this, this.world.centerX, this.world.centerY, 'Congratulations, you won!', {
            font: '50px Special Elite'
            , fill: 'FFF'
        });
        text.anchor.setTo(0.5, 0.5);
        this.add.existing(text);

        var text = new Phaser.Text(this, this.world.centerX, this.world.centerY + (constants.title_height * 1), 'Thanks for playing!', {
            font: '30px Special Elite'
            , fill: 'FFF'
        });
        text.anchor.setTo(0.5, 0.5);
        this.add.existing(text);

        var time = (this.scores['time'] / 1000).toFixed(2);
        var text = new Phaser.Text(this, this.world.centerX, this.world.centerY + (constants.title_height * 3), 'your time was: ' + time + "sec", {
            font: '30px Special Elite'
            , fill: 'FFF'
        });
        text.anchor.setTo(0.5, 0.5);
        this.add.existing(text);

        if (new_highscore) {
            var highscore_text = 'a new high score!';
        } else {
            var time = (highscore / 1000).toFixed(2);
            var highscore_text = 'current high score: ' + time + 'sec'
        }

        var text = new Phaser.Text(this, this.world.centerX, this.world.centerY + (constants.title_height * 4), highscore_text, {
            font: '30px Special Elite'
            , fill: 'FFF'
        });
        text.anchor.setTo(0.5, 0.5);
        this.add.existing(text);

    }

    return WinState;
})