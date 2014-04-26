// contents of main.js:
require.config({
});

require(['./gameState'], function(GameState) {

    var game = new Phaser.Game(640, 320, Phaser.AUTO, 'game');

    game.state.add('Game', GameState);

    game.state.start('Game');

});