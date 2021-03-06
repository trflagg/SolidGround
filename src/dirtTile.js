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

        this.mineral_score = {
            'lightblue': 0
            , 'magenta': 0
        };
    };

    DirtTile.prototype = Object.create(Phaser.Sprite.prototype);
    DirtTile.prototype.constructor = DirtTile;

    DirtTile.prototype.makeMineral = function() {
        if (this.game.rnd.frac() < constants.mineral_rand) {
            this.setLightBlue(constants.lightblue_50_score);
        }
        else if (this.game.rnd.frac() < constants.mineral_rand) {
            this.setLightBlue(constants.lightblue_25_score);
        }
        else if (this.game.rnd.frac() < constants.mineral_rand) {
            this.setMagenta(constants.magenta_50_score);
        }
        else if (this.game.rnd.frac() < constants.mineral_rand) {
            this.setMagenta(constants.magenta_25_score);
        }
    };

    DirtTile.prototype.setLightBlue = function(amount) {
        if (this.mineralSprite) {
            this.mineralSprite.destroy();
        }

        if (amount === constants.lightblue_50_score) {
            this.mineral_score['lightblue'] = constants.lightblue_50_score;
            this.mineralSprite = this.game.add.sprite(this.x, this.y, 'mineralSheet', 0);
            this.mineralSprite.bringToTop();
        }
        else if (amount === constants.lightblue_25_score) {
            this.mineral_score['lightblue'] = constants.lightblue_25_score;
            this.mineralSprite = this.game.add.sprite(this.x, this.y, 'mineralSheet', 1);
            this.mineralSprite.bringToTop();
        }
    };

    DirtTile.prototype.setMagenta = function(amount) {
        if (this.mineralSprite) {
            this.mineralSprite.destroy();
        }

        if (amount === constants.magenta_50_score) {
            this.mineral_score['magenta'] = constants.magenta_50_score;
            this.mineralSprite = this.game.add.sprite(this.x, this.y, 'mineralSheet', 2);
            this.mineralSprite.bringToTop();
        }
        else if (amount === constants.magenta_25_score) {
            this.mineral_score['magenta'] = constants.magenta_25_score;
            this.mineralSprite = this.game.add.sprite(this.x, this.y, 'mineralSheet', 3);
            this.mineralSprite.bringToTop();
        }
    };

    DirtTile.prototype.setBomb = function(bomb_type, neighbors) {
        if (bomb_type === 'lightblue') {
            this.setLightBlue(constants.lightblue_50_score);
            neighbors.top ? neighbors.top.setLightBlue(constants.lightblue_25_score) : null;
            neighbors.left ? neighbors.left.setLightBlue(constants.lightblue_25_score): null;
            neighbors.bottom ? neighbors.bottom.setLightBlue(constants.lightblue_25_score) : null;
            neighbors.right ? neighbors.right.setLightBlue(constants.lightblue_25_score) : null;
        }
        if (bomb_type === 'magenta') {
            this.setMagenta(constants.magenta_50_score);
            neighbors.top ? neighbors.top.setMagenta(constants.magenta_25_score) : null;
            neighbors.left ? neighbors.left.setMagenta(constants.magenta_25_score): null;
            neighbors.bottom ? neighbors.bottom.setMagenta(constants.magenta_25_score) : null;
            neighbors.right ? neighbors.right.setMagenta(constants.magenta_25_score) : null;
        }
    };

    DirtTile.prototype.rig = function() {
        this.rigged = true;
        this.diggable();
    };

    DirtTile.prototype.clicked = function() {
        if (this.game.fsm.is('digging') && this.is_diggable) {
            var pipe_cost = this.getPipeCost();
            if (this.game.score['$'] > pipe_cost) {
                this.pipe = true;

                this.game.score['$'] -= pipe_cost;

                if (this.mineralSprite) {
                    this.mineralSprite.kill();
                }
                this.is_diggable = false;

                this.resetMineralScores();

                this.game.boardChanged();
                this.game.emitter.x = this.x + (constants.tile_size / 2);
                this.game.emitter.y = this.y + (constants.tile_size / 2);
                // this.game.emitter.bringToTop();
                this.game.emitter.start(true, 1500, null, this.game.rnd.integerInRange(4, 6));

            }
        }
    };

    DirtTile.prototype.getPipeCost = function() {
        return constants.cost_pipe_per_level2 * Math.pow(this.j + 1, 2);
    };

    DirtTile.prototype.analyze = function(neighbors) {

        if (this.pipe) {
            this.is_diggable = false;
            console.log('pipe:' + this.x + "," + this.y);
            this.pipe_num = 0;
            this.resetMineralScores();

            if (this.rigged) {
                this.pipe_num += constants.top_pipe;
            }

            this.pipeScoreNeighbor(neighbors.top, constants.top_pipe);
            this.pipeScoreNeighbor(neighbors.right, constants.right_pipe);
            this.pipeScoreNeighbor(neighbors.bottom, constants.bottom_pipe);
            this.pipeScoreNeighbor(neighbors.left, constants.left_pipe);

            this.setPipeFrame(this.pipe_num);

            return this.mineral_score;
        }
        else {

            return null;
        }


    };

    DirtTile.prototype.pipeScoreNeighbor = function(neighbor, pipeScore) {
        if (neighbor) {
            if (neighbor.pipe) {
                this.pipe_num += pipeScore;
            } else {
                neighbor.diggable();
                
                for (mineral_score in this.mineral_score) {
                    if (this.mineral_score.hasOwnProperty(mineral_score)) {
                        this.mineral_score[mineral_score] += neighbor.mineral_score[mineral_score];
                    }
                }
            }
        }        
    };

    DirtTile.prototype.resetMineralScores = function() {
        for (mineral_score in this.mineral_score) {
            if (this.mineral_score.hasOwnProperty(mineral_score)) {
                this.mineral_score[mineral_score] = 0;
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
            this.frame = 17;
        }
    };

    DirtTile.prototype.update = function() {
    };

    return DirtTile;
});