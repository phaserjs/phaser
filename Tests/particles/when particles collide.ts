/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    var leftEmitter: Phaser.ArcadeEmitter;
    var rightEmitter: Phaser.ArcadeEmitter;

    function init() {

        game.load.image('ball1', 'assets/sprites/aqua_ball.png');
        game.load.image('ball2', 'assets/sprites/yellow_ball.png');

        game.load.start();

    }

    function create() {

        leftEmitter = game.add.emitter(0, game.stage.centerY - 200);
        leftEmitter.gravity = 100;
        leftEmitter.bounce = 0.5;
        leftEmitter.setXSpeed(100, 200);
        leftEmitter.setYSpeed(-50, 50);
        leftEmitter.makeParticles('ball1', 250, false, 1);

        rightEmitter = game.add.emitter(game.stage.width + 20, game.stage.centerY - 200);
        rightEmitter.gravity = 100;
        rightEmitter.bounce = 0.5;
        rightEmitter.setXSpeed(-100, -200);
        rightEmitter.setYSpeed(-50, 50);
        rightEmitter.makeParticles('ball2', 250, false, 1);

        leftEmitter.start(false, 50, 0.05);
        rightEmitter.start(false, 50, 0.05);

    }

    function update() {

        //game.collide(leftEmitter, rightEmitter);

    }

})();
