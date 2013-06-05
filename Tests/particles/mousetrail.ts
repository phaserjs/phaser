/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    var emitter: Phaser.Emitter;

    function init() {

        game.load.image('jet', 'assets/sprites/particle1.png');
        game.load.image('starfield', 'assets/misc/starfield.jpg');
        game.load.start();

    }

    var scroller: Phaser.ScrollZone;
    var emitter: Phaser.Emitter;

    function create() {

        scroller = game.add.scrollZone('starfield', 0, 0, 1024, 1024);
        scroller.setSpeed(0, -1);

        emitter = game.add.emitter(game.stage.centerX, game.stage.centerY);
        emitter.makeParticles('jet', 200);

        emitter.globalCompositeOperation = 'lighter';

        emitter.gravity = 300;
        emitter.setXSpeed(-50, 50);
        emitter.setYSpeed(-50, -100);
        emitter.setRotation(0, 0);
        emitter.start(false, 50, 0.02);

    }

    function update() {

        emitter.x = game.input.x;
        emitter.y = game.input.y;
        //emitter.em

    }

})();
