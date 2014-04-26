define([], function() {

    var DirtTile = function(game, x, y, i, j) {
        Phaser.Sprite.call(this, game, x, y, 'dirtTile');

        this.inputEnabled = true;
        this.events.onInputDown.add(this.clicked, this);

        this.diggable = false;
        this.i = i;
        this.j = j;
    };

    DirtTile.prototype = Object.create(Phaser.Sprite.prototype);
    DirtTile.prototype.constructor = DirtTile;

    DirtTile.prototype.clicked = function() {
        if (this.game.fsm.is('digging') && this.diggable) {
            this.kill();
        };
    };

    DirtTile.prototype.analyze = function(neighbors) {
        
    };

    return DirtTile;
});