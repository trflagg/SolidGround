define(['constants'], function(constants) {
    var WinState = function() {

    }

    WinState.prototype.create = function() {

        this.stage.backgroundColor = "#000";

        var text = new Phaser.Text(this, this.world.centerX, this.world.centerY, 'Congratulations, you won!', {
            font: '50px Special Elite'
            , fill: 'FFF'
        });
        text.anchor.setTo(0.5, 0.5);
        this.add.existing(text);
        var text = new Phaser.Text(this, this.world.centerX, this.world.centerY + constants.title_height, 'Thanks for playing!', {
            font: '30px Special Elite'
            , fill: 'FFF'
        });
        text.anchor.setTo(0.5, 0.5);
        this.add.existing(text);
    }

    return WinState;
})