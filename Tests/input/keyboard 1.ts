/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    var ufo: Phaser.Sprite,
        leftBtn: Phaser.Sprite,
        rightBtn: Phaser.Sprite;
    var speed: Number = 4;

    function init() {
        game.world.setSize(1280, 600, true);
        game.load.image('ground', 'assets/tests/ground-2x.png');
        game.load.image('river', 'assets/tests/river-2x.png');
        game.load.image('sky', 'assets/tests/sky-2x.png');
        game.load.image('cloud0', 'assets/tests/cloud-big-2x.png');
        game.load.image('cloud1', 'assets/tests/cloud-narrow-2x.png');
        game.load.image('cloud2', 'assets/tests/cloud-small-2x.png');

        game.load.spritesheet('button', 'assets/buttons/arrow-button.png', 112, 95);

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

        // Create a ufo spirte as player.
        ufo = game.add.sprite(320, 240, 'ufo');
        ufo.animations.add('fly', null, 30, false);
        ufo.animations.play('fly');
        ufo.transform.origin.setTo(0.5, 0.5);

        // Make the default camera follow the ufo.
        game.camera.follow(ufo);

        // Add 2 sprite to display hold direction.
        leftBtn = game.add.sprite(160 - 112, 200, 'button', 0);
        leftBtn.transform.scrollFactor.setTo(0, 0);
        leftBtn.alpha = 0;
        rightBtn = game.add.sprite(640 - 112, 200, 'button', 1);
        rightBtn.alpha = 0;
        rightBtn.transform.scrollFactor.setTo(0, 0);
    }
    function update() {
        // Check key states every frame.
        // Move ONLY one of the left and right key is hold.
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) &&
            !game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            ufo.x -= speed;
            ufo.rotation = -15;
            leftBtn.alpha = 0.6;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) &&
            !game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            ufo.x += speed;
            ufo.rotation = 15;
            rightBtn.alpha = 0.6;
        }
        else {
            ufo.rotation = 0;
            leftBtn.alpha = rightBtn.alpha = 0;
        }
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Hold left/right to move the ufo.');
    }
})();
