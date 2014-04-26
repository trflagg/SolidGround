define([], function() {

    var DirtTile = function(game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'dirtTile');

    };

    DirtTile.prototype = Object.create(Phaser.Sprite.prototype);
    DirtTile.prototype.constructor = DirtTile;

    return DirtTile;
});