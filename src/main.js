// contents of main.js:
require.config({
    paths: {
        'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1-rc2/jquery.min'
    }
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