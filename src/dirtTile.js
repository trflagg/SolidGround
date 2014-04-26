define([], function() {

    var DirtTile = function(game, x, y, i, j) {
        Phaser.Sprite.call(this, game, x, y, 'dirtSheet', 0);

        this.inputEnabled = true;
        this.events.onInputDown.add(this.clicked, this);

        this.is_diggable = false;
        this.pipe = false;
        this.rigged = false;
        this.i = i;
        this.j = j;
    };

    DirtTile.prototype = Object.create(Phaser.Sprite.prototype);
    DirtTile.prototype.constructor = DirtTile;

    DirtTile.prototype.makeMineral = function() {
        if (this.game.rnd.frac() < 0.1) {
            this.mineralSprite = this.game.add.sprite(this.x, this.y, 'mineralSheet', 0);
            this.mineralSprite.bringToTop();
        }
        else if (this.game.rnd.frac() < 0.1) {
            this.mineralSprite = this.game.add.sprite(this.x, this.y, 'mineralSheet', 1);
            this.mineralSprite.bringToTop();
        }
        else if (this.game.rnd.frac() < 0.1) {
            this.mineralSprite = this.game.add.sprite(this.x, this.y, 'mineralSheet', 2);
            this.mineralSprite.bringToTop();
        }
        else if (this.game.rnd.frac() < 0.1) {
            this.mineralSprite = this.game.add.sprite(this.x, this.y, 'mineralSheet', 3);
            this.mineralSprite.bringToTop();
        }
    };

    DirtTile.prototype.rig = function() {
        this.rigged = true;
        this.diggable();
    };

    DirtTile.prototype.clicked = function() {
        if (this.game.fsm.is('digging') && this.is_diggable) {

            if (this.mineralSprite) {
                this.mineralSprite.destroy();
            }
            this.frame = 2;

            this.pipe = true;
        }
    };

    DirtTile.prototype.analyze = function(neighbors) {
        if (this.pipe) {
            if (neighbors.top) neighbors.top.diggable();
            if (neighbors.left) neighbors.left.diggable();
            if (neighbors.right) neighbors.right.diggable();
            if (neighbors.bottom) neighbors.bottom.diggable();
        }
    };

    DirtTile.prototype.diggable = function() {
        if (!this.pipe) {
            this.is_diggable = true;
            this.frame = 1;
        }
    };

    DirtTile.prototype.update = function() {
    };

    return DirtTile;
});