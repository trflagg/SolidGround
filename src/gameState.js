define(['constants'
        , 'dirtTile']
        , function(constants
                   , DirtTile) {

    var GameState = function(game) {

    };

    GameState.prototype.preload = function() {
        this.load.image('dirtTile', 'img/dirtTile.png');
        this.load.image('rig', 'img/rig.png');
    };

    GameState.prototype.create = function() {
        this.stage.backgroundColor = "#33CCFF";
        this.createDirt();
    }

    GameState.prototype.createDirt = function() {
        for (i=0,ll=10; i<ll; i++) {
            for (j=0, ll2=3; j<ll2; j++) {
                this.add.existing(new DirtTile(this, i*constants.tile_size, (j+2)*constants.tile_size));
            }
        }
    };

    return GameState;
});