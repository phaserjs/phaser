/// <reference path="../../Phaser/Phaser.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create);
    var emitter;
    function init() {
        myGame.loader.addImageFile('jet', 'assets/sprites/jets.png');
        myGame.loader.load();
    }
    function create() {
        emitter = myGame.createEmitter(myGame.stage.centerX, myGame.stage.centerY);
        emitter.makeParticles('jet', 50, 0, false, 0);
        emitter.start(false, 10, 0.1);
    }
})();
