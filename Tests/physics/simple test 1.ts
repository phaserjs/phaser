/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    function init() {

        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('atari', 'assets/sprites/atari130xe.png');
        game.load.image('ball', 'assets/sprites/shinyball.png');
        game.load.start();

    }

    var atari: Phaser.Sprite;
    var ball: Phaser.Sprite;

    function create() {

        //  Add some gravity to the world, otherwise nothing will actually happen
        game.physics.gravity.setTo(0, 5);

        //  We'll make the atari sprite a static body, so it won't be influenced by gravity or other forces
        atari = game.add.physicsSprite(300, 450, 'atari', null, Phaser.Types.BODY_STATIC);
        //atari.rotation = 10;
        //atari.body.transform.setRotation(1);
        //atari.body.angle = 1;
        atari.body.setTransform(atari.body.position, 1);
        atari.body.syncTransform();

        //  atari = 220px width (110 = center x)
        //  ball = 32px width (16 = center x)

        //  Ball will be a dynamic body and fall based on gravity
        ball = game.add.physicsSprite(300-20, 0, 'ball');
        //ball.body.angle = 1;
        //ball.body.transform.setRotation(1);
        //ball.body.fixedRotation = true;

        //  limit the velocity or things can go nuts
        ball.body.linearDamping = 0.5;
        ball.body.angularDamping = 0.5;

        //  when the ball bounces out of the game world, call the resetBall function
        ball.outOfBoundsAction = Phaser.Types.OUT_OF_BOUNDS_PERSIST;
        ball.events.onOutOfBounds.add(resetBall, this);

    }

    function resetBall() {
        ball.body.setPosition(300, 0);
    }

    function render() {

        Phaser.DebugUtils.renderPhysicsBodyInfo(atari.body, 32, 32);
        Phaser.DebugUtils.renderPhysicsBodyInfo(ball.body, 320, 32);

        Phaser.DebugUtils.renderPhysicsBody(atari.body);
        Phaser.DebugUtils.renderPhysicsBody(ball.body);

    }

})();
