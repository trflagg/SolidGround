define([], function() {

    var Rig = function(game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'rig');

        this.anchor.setTo(0.5, 0.5);
    };

    Rig.prototype = Object.create(Phaser.Sprite.prototype);
    Rig.prototype.constructor = Rig;

    return Rig;
});