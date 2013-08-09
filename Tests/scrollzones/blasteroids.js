/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update, render);

    function preload() {
        game.load.image('nashwan', 'assets/sprites/xenon2_ship.png');
        game.load.image('starfield', 'assets/misc/starfield.jpg');
        game.load.image('jet', 'assets/sprites/particle1.png');
        game.load.image('bullet', 'assets/misc/bullet1.png');
    }

    var scroller;
    var emitter;
    var ship;
    var bullets;

    var speed = 0;
    var fireRate = 0;
    var shipMotion;

    function create() {
        scroller = game.add.scrollZone('starfield', 0, 0, 1024, 1024);

        emitter = game.add.emitter(game.stage.centerX + 16, game.stage.centerY + 12);
        emitter.makeParticles('jet', 250, false, 0);
        emitter.setRotation(0, 0);

        //  Looks like a smoke trail!
        //emitter.globalCompositeOperation = 'xor';
        //  Looks way cool :)
        emitter.texture.globalCompositeOperation = 'lighter';

        bullets = game.add.group(50);

        for (var i = 0; i < 50; i++) {
            var tempBullet = new Phaser.Sprite(game, game.stage.centerX, game.stage.centerY, 'bullet');
            tempBullet.exists = false;
            tempBullet.transform.rotationOffset = 90;

            //tempBullet.setBounds(-100, -100, 900, 700);
            //tempBullet.outOfBoundsAction = Phaser.GameObject.OUT_OF_BOUNDS_KILL;
            bullets.add(tempBullet);
        }

        ship = game.add.sprite(game.stage.centerX, game.stage.centerY, 'nashwan', Phaser.Types.BODY_DYNAMIC);
        ship.transform.origin.setTo(0.5, 0.5);

        //  We do this because the ship was drawn facing up, but 0 degrees is pointing to the right
        ship.transform.rotationOffset = 90;

        game.input.onDown.add(test, this);
    }

    function test(event) {
        game.stage.scale.startFullScreen();
    }

    function update() {
        ship.body.angularVelocity = 0;

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            ship.body.angularVelocity = -200;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            ship.body.angularVelocity = 200;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            speed += 0.1;

            if (speed > 10) {
                speed = 10;
            }
        } else {
            speed -= 0.1;

            if (speed < 0) {
                speed = 0;
            }
        }

        //shipMotion = game.motion.velocityFromAngle(ship.rotation, speed);
        scroller.setSpeed(shipMotion.x, shipMotion.y);

        if (speed > 2) {
            //  We use the opposite of the motion because the jets emit out the back of the ship
            //  The 20 and 30 values just keep them nice and fast
            emitter.setXSpeed(-(shipMotion.x * 20), -(shipMotion.x * 30));
            emitter.setYSpeed(-(shipMotion.y * 20), -(shipMotion.y * 30));
            emitter.emitParticle();
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            fire();
        }
    }

    function render() {
        //ship.body.renderDebugInfo(32, 32);
    }

    function recycleBullet(bullet) {
        if (bullet.exists && bullet.x < -40 || bullet.x > 840 || bullet.y < -40 || bullet.y > 640) {
            bullet.exists = false;
        }
    }

    function fire() {
        if (game.time.now > fireRate) {
            var b = bullets.getFirstAvailable();

            b.x = ship.x;
            b.y = ship.y - 26;

            //var bulletMotion = game.motion.velocityFromAngle(ship.rotation, 400);
            var bulletMotion = { x: 0, y: 0 };

            b.revive();
            b.rotation = ship.rotation;
            b.body.velocity.setTo(bulletMotion.x, bulletMotion.y);

            fireRate = game.time.now + 100;
        }
    }
})();
