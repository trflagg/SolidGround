define(['constants'], function(constants) {

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
        var pipe_num = 0;

        if (this.pipe) {
            if (this.rigged) {
                pipe_num += constants.top_pipe;
            }

            if (neighbors.top) {
                if (neighbors.top.pipe) {
                    pipe_num += constants.top_pipe;
                } else {
                    neighbors.top.diggable();
                }
            }
            if (neighbors.right) {
                if (neighbors.right.pipe) {
                    pipe_num += constants.right_pipe;
                } else {
                    neighbors.right.diggable();
                }
            }
            if (neighbors.bottom) {
                if (neighbors.bottom.pipe) {
                    pipe_num += constants.bottom_pipe;
                } else {
                    neighbors.bottom.diggable();
                }
            }
            if (neighbors.left) {
                if (neighbors.left.pipe) {
                    pipe_num += constants.left_pipe;
                } else {
                    neighbors.left.diggable();
                }
            }
        }

        this.setPipeFrame(pipe_num);
    };

    DirtTile.prototype.setPipeFrame = function(num) {
        switch(num) {
            case constants.top_pipe:
                this.frame = 2
                break;
            case constants.right_pipe:
                this.frame = 3
                break;
            case constants.bottom_pipe:
                this.frame = 4
                break;
            case constants.left_pipe:
                this.frame = 5
                break;
            case (constants.top_pipe + constants.left_pipe):
                this.frame = 6
                break;
            case (constants.top_pipe + constants.right_pipe):
                this.frame = 7
                break;
            case (constants.bottom_pipe + constants.right_pipe):
                this.frame = 8
                break;
            case (constants.bottom_pipe + constants.left_pipe):
                this.frame = 9
                break;
            case (constants.bottom_pipe + constants.left_pipe + constants.top_pipe):
                this.frame = 10
                break;
            case (constants.left_pipe + constants.top_pipe + constants.right_pipe):
                this.frame = 11
                break;
            case (constants.top_pipe + constants.right_pipe + constants.bottom_pipe):
                this.frame = 12
                break;
            case (constants.right_pipe + constants.bottom_pipe + constants.left_pipe):
                this.frame = 13
                break;
            case (constants.left_pipe + constants.top_pipe + constants.right_pipe + constants.bottom_pipe):
                this.frame = 14
                break;
            case (constants.left_pipe + constants.right_pipe):
                this.frame = 15
                break;
            case (constants.top_pipe + constants.bottom_pipe):
                this.frame = 16
                break;
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