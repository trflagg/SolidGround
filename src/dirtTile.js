define(['constants'], function(constants) {

    var DirtTile = function(game, x, y, i, j) {
        Phaser.Sprite.call(this, game, x, y, 'dirtSheet', 0);

        this.inputEnabled = true;
        this.events.onInputDown.add(this.clicked, this);

        this.is_diggable = false;
        this.pipe = false;
        this.pipe_num = 0;
        this.rigged = false;
        this.i = i;
        this.j = j;

        this.score = {
            'lightblue': 0
            , 'magenta': 0
        };
    };

    DirtTile.prototype = Object.create(Phaser.Sprite.prototype);
    DirtTile.prototype.constructor = DirtTile;

    DirtTile.prototype.makeMineral = function() {
        if (this.game.rnd.frac() < 0.1) {
            this.score['lightblue'] = constants.lightblue_50_score;
            this.mineralSprite = this.game.add.sprite(this.x, this.y, 'mineralSheet', 0);
            this.mineralSprite.bringToTop();
        }
        else if (this.game.rnd.frac() < 0.1) {
            this.score['lightblue'] = constants.lightblue_25_score;
            this.mineralSprite = this.game.add.sprite(this.x, this.y, 'mineralSheet', 1);
            this.mineralSprite.bringToTop();
        }
        else if (this.game.rnd.frac() < 0.1) {
            this.score['magenta'] = constants.magenta_50_score;
            this.mineralSprite = this.game.add.sprite(this.x, this.y, 'mineralSheet', 2);
            this.mineralSprite.bringToTop();
        }
        else if (this.game.rnd.frac() < 0.1) {
            this.score['magenta'] = constants.magenta_25_score;
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
            this.resetScores();

            this.game.boardChanged();
        }
    };

    DirtTile.prototype.analyze = function(neighbors) {

        if (this.pipe) {
            this.pipe_num = 0;
            this.resetScores();

            if (this.rigged) {
                this.pipe_num += constants.top_pipe;
            }

            this.pipeScoreNeighbor(neighbors.top, constants.top_pipe);
            this.pipeScoreNeighbor(neighbors.right, constants.right_pipe);
            this.pipeScoreNeighbor(neighbors.bottom, constants.bottom_pipe);
            this.pipeScoreNeighbor(neighbors.left, constants.left_pipe);

            this.setPipeFrame(this.pipe_num);

            return this.score;
        }

        return null;

    };

    DirtTile.prototype.pipeScoreNeighbor = function(neighbor, pipeScore) {
        if (neighbor) {
            if (neighbor.pipe) {
                this.pipe_num += pipeScore;
            } else {
                neighbor.diggable();
                
                for (mineral_score in this.score) {
                    if (this.score.hasOwnProperty(mineral_score)) {
                        this.score[mineral_score] += neighbor.score[mineral_score];
                    }
                }
            }
        }        
    };

    DirtTile.prototype.resetScores = function() {
        for (mineral_score in this.score) {
            if (this.score.hasOwnProperty(mineral_score)) {
                this.score[mineral_score] = 0;
            }
        }
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