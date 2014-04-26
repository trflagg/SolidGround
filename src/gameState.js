define(['constants'
        , 'gameFSM'
        , 'dirtTile']
        , function(constants
                   , GameFSM
                   , DirtTile) {

    var GameState = function(game) {

    };

    GameState.prototype.preload = function() {
        this.load.image('dirtTile', 'img/dirtTile.png');
        this.load.image('rig', 'img/rig.png');
    };

    GameState.prototype.create = function() {
        this.stage.backgroundColor = "#33CCFF";
        this.create_dirt();

        this.input.moveCallback = this.mouse_moved;

        this.fsm = new GameFSM(this);
        this.fsm.startup();
    };

    GameState.prototype.create_dirt = function() {
        for (i=0,ll=10; i<ll; i++) {
            for (j=0, ll2=3; j<ll2; j++) {
                this.add.existing(new DirtTile(this, i*constants.tile_size, (j+2)*constants.tile_size));
            }
        }
    };

    GameState.prototype.update = function() {
        // placeRig
        if (this.fsm.is('placeRig')) {
            var x = this.input.x
                , y = this.input.y
                , tile_size = constants.tile_size;

            // only place on the top row
            if (y > (1 * tile_size) && y <= (2 * tile_size)) {
                // lock x 
                x = Math.floor(x/tile_size);
                this._placingRig.x = x * tile_size + (0.5 * tile_size);
                this._placingRig.y = (2 * tile_size) - (0.5 * tile_size);
            }
            else {
                this._placingRig.x = constants.exile_x;
                this._placingRig.y = constants.exile_y;
            }

        }
    }

    return GameState;
});