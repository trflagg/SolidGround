define([], function() {

    var Rig = function(game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'rig', 0);
        this.refinery = false;
        this.anchor.setTo(0.5, 0.5);
    };

    Rig.prototype = Object.create(Phaser.Sprite.prototype);
    Rig.prototype.constructor = Rig;

    Rig.prototype.upgrade = function() {
        this.refinery = true;
        this.frame = 1;
    };
    return Rig;
});