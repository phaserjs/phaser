/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    var ufo: Phaser.Sprite;
    var speed: number = 4;

    function init() {
        game.world.setSize(1280, 600, true);
        game.load.image('ground', 'assets/tests/ground-2x.png');
        game.load.image('river', 'assets/tests/river-2x.png');
        game.load.image('sky', 'assets/tests/sky-2x.png');
        game.load.image('cloud0', 'assets/tests/cloud-big-2x.png');
        game.load.image('cloud1', 'assets/tests/cloud-narrow-2x.png');
        game.load.image('cloud2', 'assets/tests/cloud-small-2x.png');

        game.load.spritesheet('ufo', 'assets/sprites/ufo.png', 24, 21);

        game.load.start();
    }
    function create() {
        // background images
        game.add.sprite(0, 0, 'sky')
            .transform.scrollFactor.setTo(0, 0);
        game.add.sprite(0, 360, 'ground')
            .transform.scrollFactor.setTo(0.5, 0.5);
        game.add.sprite(0, 400, 'river')
            .transform.scrollFactor.setTo(1.3, 1.3);
        game.add.sprite(200, 120, 'cloud0')
            .transform.scrollFactor.setTo(0.3, 0.3);
        game.add.sprite(-60, 120, 'cloud1')
            .transform.scrollFactor.setTo(0.5, 0.3);
        game.add.sprite(900, 170, 'cloud2')
            .transform.scrollFactor.setTo(0.7, 0.3);

        // ufo spirte
        ufo = game.add.sprite(320, 240, 'ufo');
        ufo.animations.add('fly', null, 30, false);
        ufo.animations.play('fly');
        ufo.transform.origin.setTo(0.5, 0.5);

        // make camera follows ufo
        game.camera.follow(ufo);
    }
    function update() {
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            ufo.x -= speed;
            ufo.rotation = -15;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            ufo.x += speed;
            ufo.rotation = 15;
        }
        else {
            ufo.rotation = 0;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            ufo.y -= speed;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            ufo.y += speed;
        }
    }
})();
