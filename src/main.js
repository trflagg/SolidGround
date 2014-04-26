// contents of main.js:
require.config({
});

require(['./constants'
         , './gameState']
         , function(constants
                    , GameState) {

    var game = new Phaser.Game(constants.game_size_x * constants.tile_size
                                , constants.game_size_y * constants.tile_size
                                , Phaser.AUTO, 'game');

    game.state.add('Game', GameState);

    game.state.start('Game');

});