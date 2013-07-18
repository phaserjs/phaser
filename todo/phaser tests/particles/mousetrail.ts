/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    var emitter: Phaser.Emitter;

    function init() {

        myGame.loader.addImageFile('jet', 'assets/sprites/particle1.png');

        myGame.loader.load();

    }

    function create() {

        emitter = myGame.add.emitter(myGame.stage.centerX, myGame.stage.centerY);
        emitter.makeParticles('jet', 100);

        emitter.gravity = 200;
        emitter.setXSpeed(-50, 50);
        emitter.setYSpeed(-50, -100);
        emitter.setRotation(0, 0);
        emitter.start(false, 10, 0.05);

    }

    function update() {

        emitter.x = myGame.input.x;
        emitter.y = myGame.input.y;
        //emitter.em

    }

})();
