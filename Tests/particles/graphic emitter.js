/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create);
    var emitter;
    function init() {
        game.load.image('jet', 'assets/sprites/jets.png');
        game.load.start();
    }
    function create() {
        emitter = game.add.emitter(game.stage.centerX, game.stage.centerY);
        emitter.makeParticles('jet', 100, false, 0);
        emitter.start(false, 20, 0.1);
    }
})();
