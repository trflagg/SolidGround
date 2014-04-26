define([], function() {

    var DirtTile = function(game, x, y, i, j) {
        Phaser.Sprite.call(this, game, x, y, 'dirtTile', 0);

        this.inputEnabled = true;
        this.events.onInputDown.add(this.clicked, this);

        this.is_diggable = false;
        this.i = i;
        this.j = j;
    };

    DirtTile.prototype = Object.create(Phaser.Sprite.prototype);
    DirtTile.prototype.constructor = DirtTile;

    DirtTile.prototype.clicked = function() {
        if (this.game.fsm.is('digging') && this.is_diggable) {
            this.kill();
        };
    };

    DirtTile.prototype.analyze = function(neighbors) {
        
    };

    DirtTile.prototype.diggable = function() {
        this.is_diggable = true;
        this.frame = 1;
    };

    DirtTile.prototype.update = function() {
    };

    return DirtTile;
});