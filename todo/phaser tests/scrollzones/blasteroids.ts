/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/ScrollZone.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.loader.addImageFile('nashwan', 'assets/sprites/xenon2_ship.png');
        myGame.loader.addImageFile('starfield', 'assets/misc/starfield.jpg');
        myGame.loader.addImageFile('jet', 'assets/sprites/particle1.png');
        myGame.loader.addImageFile('bullet', 'assets/misc/bullet1.png');

        myGame.loader.load();

    }

    var scroller: Phaser.ScrollZone;
    var emitter: Phaser.Emitter;
    var ship: Phaser.Sprite;
    var bullets: Phaser.Group;

    var speed: number = 0;
    var fireRate: number = 0;
    var shipMotion: Phaser.Point;

    function create() {

        scroller = myGame.add.scrollZone('starfield', 0, 0, 1024, 1024);

        emitter = myGame.add.emitter(myGame.stage.centerX + 16, myGame.stage.centerY + 12);
        emitter.makeParticles('jet', 250, false, 0);
        emitter.setRotation(0, 0);

        //  Looks like a smoke trail!
        //emitter.globalCompositeOperation = 'xor';

        //  Looks way cool :)
        emitter.globalCompositeOperation = 'lighter';

        bullets = myGame.add.group(50);

        //  Create our bullet pool
        for (var i = 0; i < 50; i++)
        {
            var tempBullet = new Phaser.Sprite(myGame, myGame.stage.centerX, myGame.stage.centerY, 'bullet');
            tempBullet.exists = false;
            tempBullet.rotationOffset = 90;
            tempBullet.setBounds(-100, -100, 900, 700);
            tempBullet.outOfBoundsAction = Phaser.GameObject.OUT_OF_BOUNDS_KILL;
            bullets.add(tempBullet);
        }

        ship = myGame.add.sprite(myGame.stage.centerX, myGame.stage.centerY, 'nashwan');

        //  We do this because the ship was drawn facing up, but 0 degrees is pointing to the right
        ship.rotationOffset = 90;

        myGame.input.onDown.add(test, this);

    }

    function test(event) {

        myGame.stage.scale.startFullScreen();

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

        shipMotion = myGame.motion.velocityFromAngle(ship.angle, speed);

        scroller.setSpeed(shipMotion.x, shipMotion.y);

        //  emit particles
        if (speed > 2)
        {
            //  We use the opposite of the motion because the jets emit out the back of the ship
            //  The 20 and 30 values just keep them nice and fast
            emitter.setXSpeed(-(shipMotion.x * 20), -(shipMotion.x * 30));
            emitter.setYSpeed(-(shipMotion.y * 20), -(shipMotion.y * 30));
            emitter.emitParticle();
        }

        if (myGame.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            fire();
        }

    }

    function recycleBullet(bullet:Phaser.Sprite) {

        if (bullet.exists && bullet.x < -40 || bullet.x > 840 || bullet.y < -40 || bullet.y > 640)
        {
            bullet.exists = false;
        }

    }

    function fire() {

        if (myGame.time.now > fireRate)
        {
            var b:Phaser.Sprite = bullets.getFirstAvailable();

            b.x = ship.x;
            b.y = ship.y - 26;

            var bulletMotion = myGame.motion.velocityFromAngle(ship.angle, 400);

            b.revive();
            b.angle = ship.angle;
            b.velocity.setTo(bulletMotion.x, bulletMotion.y);

            fireRate = myGame.time.now + 100;
        }

    }

})();
