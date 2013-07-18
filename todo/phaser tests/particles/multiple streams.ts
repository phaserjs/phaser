/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    var emitter1: Phaser.Emitter;
    var emitter2: Phaser.Emitter;
    var emitter3: Phaser.Emitter;
    var emitter4: Phaser.Emitter;
    var emitter5: Phaser.Emitter;
    var emitter6: Phaser.Emitter;

    function init() {

        myGame.loader.addImageFile('ball1', 'assets/sprites/aqua_ball.png');
        myGame.loader.addImageFile('ball2', 'assets/sprites/yellow_ball.png');
        myGame.loader.addImageFile('ball3', 'assets/sprites/red_ball.png');
        myGame.loader.addImageFile('ball4', 'assets/sprites/purple_ball.png');
        myGame.loader.addImageFile('ball5', 'assets/sprites/blue_ball.png');
        myGame.loader.addImageFile('ball6', 'assets/sprites/green_ball.png');

        myGame.loader.load();

    }

    function makeEmitter(emitter, x, y, graphic) {

        emitter = myGame.add.emitter(x, y);
        emitter.gravity = 100;
        emitter.bounce = 0.5;

        if (x == 0)
        {
            emitter.setXSpeed(200, 250);
        }
        else
        {
            emitter.setXSpeed(-200, -250);
        }

        emitter.setYSpeed(-50, -10);
        emitter.makeParticles(graphic, 250, false, 0);

        return emitter;

    }

    function create() {

        emitter1 = makeEmitter(emitter1, 0, 50, 'ball1');
        emitter2 = makeEmitter(emitter2, 0, 250, 'ball2');
        emitter3 = makeEmitter(emitter3, 0, 450, 'ball3');
        emitter4 = makeEmitter(emitter4, myGame.stage.width, 50, 'ball4');
        emitter5 = makeEmitter(emitter5, myGame.stage.width, 250, 'ball5');
        emitter6 = makeEmitter(emitter6, myGame.stage.width, 450, 'ball6');

        emitter1.start(false, 50, 0.05);
        emitter2.start(false, 50, 0.05);
        emitter3.start(false, 50, 0.05);
        emitter4.start(false, 50, 0.05);
        emitter5.start(false, 50, 0.05);
        emitter6.start(false, 50, 0.05);

    }

    function update() {

        //myGame.collide(leftEmitter, rightEmitter);

    }

})();
