/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create);
    var emitter;
    function init() {
        game.loader.addImageFile('jet', 'assets/sprites/jets.png');
        game.loader.load();
    }
    function create() {
        emitter = game.add.emitter(game.stage.centerX, game.stage.centerY);
        emitter.makeParticles('jet', 50, false, 0);
        emitter.start(false, 10, 0.1);
    }
})();
