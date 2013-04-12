/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/Sprite.ts" />
/// <reference path="../../Phaser/Emitter.ts" />

(function () {

    var myGame = new Game(this, 'game', 800, 600, init, create);

    var emitter: Emitter;

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
