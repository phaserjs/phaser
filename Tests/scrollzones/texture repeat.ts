/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/ScrollZone.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.loader.addImageFile('nashwan', 'assets/sprites/xenon2_ship.png');
        myGame.loader.addImageFile('starfield', 'assets/misc/starfield.jpg');
        myGame.loader.addImageFile('jet', 'assets/sprites/jets.png');

        myGame.loader.load();

    }

    var scroller: Phaser.ScrollZone;
    var emitter: Phaser.Emitter;
    var ship: Phaser.Sprite;

    var speed: number = 0;

    function create() {

        scroller = myGame.createScrollZone('starfield', 0, 0, 1024, 1024);

        emitter = myGame.createEmitter(myGame.stage.centerX + 16, myGame.stage.centerY + 12);
        emitter.makeParticles('jet', 250, 0, false, 0);
        //emitter.lifespan


        ship = myGame.createSprite(myGame.stage.centerX, myGame.stage.centerY, 'nashwan');

        //  We do this because the ship was drawn facing up, but 0 degrees is pointing to the right
        ship.rotationOffset = 90;

    }

    function update() {

		ship.angularVelocity = 0;

        if (myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            ship.angularVelocity = -200;
        }
        else if (myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            ship.angularVelocity = 200;
        }

        if (myGame.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            speed += 0.1;

            if (speed > 10)
            {
                speed = 10;
            }
        }
        else
        {
            speed -= 0.1;

            if (speed < 0) {
                speed = 0;
            }
        }

        var motion:Phaser.Point = myGame.motion.velocityFromAngle(ship.angle, speed);

        scroller.setSpeed(motion.x, motion.y);

        //  emit particles
        if (speed > 2)
        {
            emitter.setXSpeed(-(motion.x * 20), -(motion.x * 30));
            emitter.setYSpeed(-(motion.y * 20), -(motion.y * 30));
            emitter.emitParticle();
        }

    }

})();
