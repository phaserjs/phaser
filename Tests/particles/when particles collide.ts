/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    var leftEmitter: Phaser.Emitter;
    var rightEmitter: Phaser.Emitter;

    function init() {

        myGame.loader.addImageFile('ball1', 'assets/sprites/aqua_ball.png');
        myGame.loader.addImageFile('ball2', 'assets/sprites/yellow_ball.png');

        myGame.loader.load();

    }

    function create() {

        leftEmitter = myGame.createEmitter(0, myGame.stage.centerY - 200);
        leftEmitter.gravity = 100;
        leftEmitter.bounce = 0.5;
        leftEmitter.setXSpeed(100, 200);
        leftEmitter.setYSpeed(-50, 50);
        leftEmitter.makeParticles('ball1', 250, 0, false, 1);


        rightEmitter = myGame.createEmitter(myGame.stage.width, myGame.stage.centerY - 200);
        rightEmitter.gravity = 100;
        rightEmitter.bounce = 0.5;
        rightEmitter.setXSpeed(-100, -200);
        rightEmitter.setYSpeed(-50, 50);
        rightEmitter.makeParticles('ball2', 250, 0, false, 1);

        leftEmitter.start(false, 50, 0.05);
        rightEmitter.start(false, 50, 0.05);

    }

    function update() {

        myGame.collide(leftEmitter, rightEmitter);

    }

})();
