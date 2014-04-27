// contents of main.js:
require.config({
    paths: {
        'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1-rc2/jquery.min',
        'jquery-cookie': '../lib/jquery-cookie/jquery.cookie'
    }

    , shim: {
        'jquery-cookie': ['jquery'],
    }
});

require(['./constants'
         , './gameState'
         , './winState']
         , function(constants
                    , GameState
                    , WinState) {

    var game = new Phaser.Game(constants.game_size_x * constants.tile_size
                                , constants.game_size_y * constants.tile_size
                                , Phaser.AUTO, 'game');

    game.state.add('Game', GameState);
    game.state.add('Win', WinState);

    game.state.start('Game');

});