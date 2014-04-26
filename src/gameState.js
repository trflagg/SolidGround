require([], function() {

    var GameState = function(game) {

    };

    GameState.prototype.preload = function() {
        this.load.image('dirtTile', 'img/dirtTile.png');
    };

    GameState.prototype.create = function() {
        console.log('hello');
    }
});