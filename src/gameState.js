define(['constants'
        , 'gameFSM'
        , 'dirtTile'
        , 'scoreText'
        , 'storeText']
        , function(constants
                   , GameFSM
                   , DirtTile
                   , ScoreText
                   , StoreText) {

    var GameState = function(game) {

    };

    GameState.prototype.preload = function() {
        this.load.spritesheet('dirtSheet', 'img/dirtSheetBlack32.png', constants.tile_size, constants.tile_size);
        this.load.spritesheet('mineralSheet', 'img/mineralSheet32.png', constants.tile_size, constants.tile_size);
        this.load.spritesheet('diggableSheet', 'img/diggableSheet.png', constants.tile_size, constants.tile_size);
        this.load.spritesheet('rig', 'img/rig32-2.png', constants.tile_size, constants.tile_size);

        this.load.image('rock1', 'img/rock1.png');
        this.load.image('rock2', 'img/rock2.png');
        this.load.image('rock3', 'img/rock3.png');
    };

    GameState.prototype.create = function() {

        this.rigs = [];
        this.dirt = [];
        this.refineries = 0;

        this.score = {
            '$': 0
            , '$/sec': 100
            , 'lb': 0
            , 'ma': 0
            , 'time': 0
        };
        this.base_rate = this.score['$/sec'];
        this.last_update = this.game.time.now;

        this.rig_store = new StoreText(this, 0, constants.store_start_y, 'rig', constants.cost_rig, '$' );
        this.add.existing(this.rig_store);
        var text = "buy another rig for $"+constants.cost_rig;
        this.rig_store.text = text;

        this.refinery_store = new StoreText(this, 0, constants.store_start_y + constants.score_height, 'refinery', constants.cost_refinery, '$' );
        this.add.existing(this.refinery_store);
        var text = "upgrade to a refinery for $"+constants.cost_refinery;
        this.refinery_store.text = text;

        this.time_score = new ScoreText(this, 0, (constants.score_height*1) + constants.score_y, 'time', {
            font: '25px PT Sans'
            , fill: 'DDD'
        });
        this.time_score.suffix = "sec";
        this.add.existing(this.time_score);

        this.money_score = new ScoreText(this, 0, (constants.score_height*2) + constants.score_y, '$', {
            font: '25px PT Sans'
            , fill: 'FF0'
        });
        this.money_score.max = "$" + constants.win_score;
        this.add.existing(this.money_score);

        this.lb_score = new ScoreText(this, 0, (constants.score_height*3) + constants.score_y, '', {
            font: '25px PT Sans'
            , fill: '0FF'
        });
        this.add.existing(this.lb_score);

        this.ma_score = new ScoreText(this, 0, (constants.score_height*4) + constants.score_y, '', {
            font: '25px PT Sans'
            , fill: 'F0F'
        });
        this.add.existing(this.ma_score);

        this.base_score = new ScoreText(this, 0, (constants.score_height*5) + constants.score_y, '$base', {
            font: '25px PT Sans'
            , fill: 'FF0'
        });
        this.base_score.score = this.score['$/sec'];
        this.add.existing(this.base_score);

        this.money_per_second_score = new ScoreText(this, 0, (constants.score_height*6) + constants.score_y, '$/sec', {
            font: '25px PT Sans'
            , fill: 'FF0'
        });
        this.add.existing(this.money_per_second_score);

        this.updateScores();

        this.mineral_score = {
            'lightblue': 0
            , 'magenta': 0
        };

        this.stage.backgroundColor = "#000";
        this.create_dirt();

        this.setBombs(constants.layer_1_cutoff, constants.layer_1_min, constants.layer_1_max);
        this.setBombs(constants.layer_2_cutoff, constants.layer_2_min, constants.layer_2_max);

        this.input.moveCallback = this.mouse_moved;
        this.input.onDown.add(this.onDown, this);

        this.emitter = this.add.emitter(constants.exile_x, constants.exile_y, 100);
        // this.emitter.bringToTop();
        this.emitter.particleBringToTop = true;
        this.emitter.makeParticles(['rock1', 'rock2', 'rock3']);

        this.fsm = new GameFSM(this);
        this.fsm.startup();
    };

    GameState.prototype.create_dirt = function() {
        for (i=0,ll=constants.dirt_size_x; i<ll; i++) {
            this.dirt[i] = [];

            for (j=0, ll2=constants.dirt_size_y; j<ll2; j++) {
                var dirt_tile = new DirtTile(this, i*constants.tile_size, (j+constants.dirt_start)*constants.tile_size, i, j);
                this.add.existing(dirt_tile);
                this.dirt[i][j] = dirt_tile;
                dirt_tile.makeMineral();
            }
        }
    };

    GameState.prototype.setBombs = function(cutoff, min, max) {
        var bomb_count = this.rnd.integerInRange(min, max);

        for (var i=0, ll=bomb_count; i<ll; i++) {
            var bomb_center_i = this.rnd.integerInRange(0, constants.dirt_size_x - 1)
                , bomb_center_j = this.rnd.integerInRange(cutoff, constants.dirt_size_y - 1)
                , bomb_type = this.rnd.pick(['lightblue', 'magenta'])

            var neighbors = this.getNeighbors(bomb_center_i, bomb_center_j);
            this.dirt[bomb_center_i][bomb_center_j].setBomb(bomb_type, neighbors);
        }
    };

    GameState.prototype.update = function() {
        // placeRig
        if (this.fsm.is('placing_rig')) {
            var x = this.input.x
                , y = this.input.y
                , tile_size = constants.tile_size;

            if (!this.placing_rig) {
                console.error('ERROR!!! NO PLACING RIG!');
                return;
            }

            // only place on the top row
            if (y > (1 * tile_size) && y <= (constants.dirt_start * tile_size)) {
                // lock x 
                x = Math.floor(x/tile_size);
                
                this.placing_rig.x = x * tile_size + (0.5 * tile_size);
                this.placing_rig.y = (constants.dirt_start * tile_size) - (0.5 * tile_size);
                this.placing_rig.i = x;
            }
            else {
                this.placing_rig.x = constants.exile_x;
                this.placing_rig.y = constants.exile_y;
            }

        }
        // update each tile
        else {
            for (var i=0, ll=constants.dirt_size_x; i<ll; i++) {
                for(var j=0, ll2=constants.dirt_size_y; j<ll2; j++) {
                    if (this.dirt[i][j].is_diggable) {
                        if (this.score['$'] > this.dirt[i][j].getPipeCost()) {
                            this.dirt[i][j].frame = 1;
                        }
                        else {
                            this.dirt[i][j].frame = 17;
                        }
                    }
                }
            }
        }

        // scores
        var time_delta = this.game.time.elapsedSince(this.last_update)
        this.last_update = this.game.time.now;
        this.score['$'] += Math.floor(this.score['$/sec'] * (time_delta / 1000));
        this.score['time'] += Math.floor((time_delta ));
        this.updateScores();

        // check for win
        if (this.score['$'] > constants.win_score) {
            this.state.start('Win', true, true, this.score);
        }
    };

    GameState.prototype.updateScores = function() {
        this.money_score.score = Math.floor(this.score['$']);
        this.money_per_second_score.score = Math.floor(this.score['$/sec']);
        this.lb_score.score = Math.floor(this.score['lb'] * constants.rate_$_per_second_lb);
        this.ma_score.score = Math.floor(this.score['ma'] * constants.rate_$_per_second_ma * (this.refineries + 1));
        this.time_score.score = (this.score['time'] / 1000).toFixed(2);
    };

    GameState.prototype.onDown = function() {
        var x = this.input.x
            , y = this.input.y
            , tile_size = constants.tile_size;

        if (this.fsm.is('placing_rig')) {
            if (!this.placing_rig) {
                console.error('ERROR!!! NO PLACING RIG!');
                return;
            }

            // only place on the top row
            if (y > (1 * tile_size) && y <= (constants.dirt_start * tile_size)) {
                // lock x 
                x = Math.floor(x/tile_size);
                
                this.placing_rig.x = x * tile_size + (0.5 * tile_size);
                this.placing_rig.y = (constants.dirt_start * tile_size) - (0.5 * tile_size);

                // check if another rig is there
                for(var i=0, ll=this.rigs.length; i<ll; i++) {
                    if (this.rigs[i].x === this.placing_rig.x &&
                        this.rigs[i].y === this.placing_rig.y) 
                    {
                        return;
                    }
                }

                this.fsm.placeRig();
            }
        }
    };

    GameState.prototype.boardChanged = function() {
        this.resetMineralScores();

        // analyze
        this.analyzeDirt();

        // set scores
        console.log('lb:' + this.mineral_score['lightblue']);
        console.log('mb:' + this.mineral_score['magenta']);
        this.score['lb'] = this.mineral_score['lightblue'];
        this.score['ma'] = this.mineral_score['magenta'];

        this.score['$/sec'] = this.base_rate + 
                                this.mineral_score['lightblue'] * constants.rate_$_per_second_lb +
                                this.mineral_score['magenta'] * constants.rate_$_per_second_ma * (this.refineries + 1);

    };

    GameState.prototype.resetMineralScores = function() {
        for (mineral_score in this.mineral_score) {
            if (this.mineral_score.hasOwnProperty(mineral_score)) {
                this.mineral_score[mineral_score] = 0;
            }
        }
    };

    GameState.prototype.analyzeDirt = function() {
        for (i=0,ll=constants.dirt_size_x; i<ll; i++) {
            for (j=0, ll2=constants.dirt_size_y; j<ll2; j++) {
                var neighbors = this.getNeighbors(i, j);

                var result = this.dirt[i][j].analyze(neighbors);
                if (result) {
                    for (mineral_score in this.mineral_score) {
                        if (this.mineral_score.hasOwnProperty(mineral_score)) {
                            this.mineral_score[mineral_score] += result[mineral_score];
                        }
                    }
                }
            }
        }

    };

    GameState.prototype.getNeighbors = function(i, j) {
        var left = i > 0 ? this.dirt[i-1][j] : null
           , right = i < constants.dirt_size_x - 1 ? this.dirt[i+1][j] : null
           , top = j > 0 ? this.dirt[i][j-1] : null
           , bottom = j < constants.dirt_size_y - 1 ? this.dirt[i][j+1] : null;

        return {
            top: top
            , left: left
            , bottom: bottom
            , right: right
        };
    };

    GameState.prototype.buy = function(store, name) {

        if (name === 'rig') {
            this.score[store.currency] -= store.price;
            this.fsm.buyARig();
        }

        if (name === 'refinery') {
            var suitable_rigs = [];
            for (var i=0, ll=this.rigs.length; i<ll; i++) {
                if (!this.rigs[i].refinery) {
                    suitable_rigs.push(this.rigs[i]);
                }
            }
            if (suitable_rigs.length > 0) {
                this.refineries++;
                this.score[store.currency] -= store.price;
                var upgrade_rig = this.rnd.pick(suitable_rigs);
                upgrade_rig.upgrade();
            }
        }
    };

    return GameState;
});