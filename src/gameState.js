define(['constants'
        , 'gameFSM'
        , 'dirtTile']
        , function(constants
                   , GameFSM
                   , DirtTile) {

    var GameState = function(game) {

    };

    GameState.prototype.preload = function() {
        this.load.spritesheet('dirtSheet', 'img/dirtSheetBlack32.png', constants.tile_size, constants.tile_size);
        this.load.spritesheet('mineralSheet', 'img/mineralSheet32.png', constants.tile_size, constants.tile_size);
        this.load.image('rig', 'img/rig32.png');
    };

    GameState.prototype.create = function() {

        this.rigs = this.add.group();
        this.dirt = [];

        this.stage.backgroundColor = "#000";
        this.create_dirt();

        this.input.moveCallback = this.mouse_moved;
        this.input.onDown.add(this.onDown, this);

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

    GameState.prototype.analyzeDirt = function() {
        for (i=0,ll=constants.dirt_size_x; i<ll; i++) {
            for (j=0, ll2=constants.dirt_size_y; j<ll2; j++) {
                var left = i > 0 ? this.dirt[i-1][j] : null
                   , right = i < constants.dirt_size_x - 1 ? this.dirt[i+1][j] : null
                   , top = j > 0 ? this.dirt[i][j-1] : null
                   , bottom = j < constants.dirt_size_y - 1 ? this.dirt[i][j+1] : null;

                this.dirt[i][j].analyze({left: left, right: right, top: top, bottom: bottom});
            }
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

        // analyze
        this.analyzeDirt();
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

                this.fsm.placeRig();
            }
        }
    };

    return GameState;
});