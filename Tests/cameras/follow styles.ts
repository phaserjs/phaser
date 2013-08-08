/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    var ufo: Phaser.Sprite,
        speed: number = 4;

    var btn0: Phaser.UI.Button,
        btn1: Phaser.UI.Button,
        btn2: Phaser.UI.Button,
        btn3: Phaser.UI.Button;
    var style: string = 'default';

    function init() {
        game.world.setSize(1280, 800, true);
        game.load.image('ground', 'assets/tests/ground-2x.png');
        game.load.image('river', 'assets/tests/river-2x.png');
        game.load.image('sky', 'assets/tests/sky-2x.png');
        game.load.image('cloud0', 'assets/tests/cloud-big-2x.png');
        game.load.image('cloud1', 'assets/tests/cloud-narrow-2x.png');
        game.load.image('cloud2', 'assets/tests/cloud-small-2x.png');

        game.load.spritesheet('button', 'assets/buttons/follow-style-button.png', 224, 70);

        game.load.spritesheet('ufo', 'assets/sprites/ufo.png', 24, 21);

        game.load.start();
    }
    function create() {
        // background images
        game.add.sprite(0, 0, 'sky')
            .transform.scrollFactor.setTo(0, 0);
        game.add.sprite(0, 360, 'ground')
            .transform.scrollFactor.setTo(0.5, 0.1);
        game.add.sprite(0, 400, 'river')
            .transform.scrollFactor.setTo(1.3, 0.16);
        game.add.sprite(200, 120, 'cloud0')
            .transform.scrollFactor.setTo(0.3, 0.1);
        game.add.sprite(-60, 120, 'cloud1')
            .transform.scrollFactor.setTo(0.5, 0.1);
        game.add.sprite(900, 170, 'cloud2')
            .transform.scrollFactor.setTo(0.7, 0.1);
        // ufo spirte
        ufo = game.add.sprite(360, 240, 'ufo');
        ufo.animations.add('fly', null, 30, false);
        ufo.animations.play('fly');
        ufo.transform.origin.setTo(0.5, 0.5);

        // make camera follows ufo
        game.camera.follow(ufo);

        // follow style switch buttons
        btn0 = game.add.button(16, 40, 'button', lockonFollow, 0, 0, 0);
        btn1 = game.add.button(16, 120, 'button', platformerFollow, 1, 1, 1);
        btn2 = game.add.button(16, 200, 'button', topdownFollow, 2, 2, 2);
        btn3 = game.add.button(16, 280, 'button', topdownTightFollow, 3, 3, 3);
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
    function render() {
        if (game.camera.deadzone) {
            Phaser.DebugUtils.renderRectangle(game.camera.deadzone, 'rgba(240, 112, 111, 0.4)');
        }
        // game.camera.renderDebugInfo(400, 16);
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Click buttons to switch between different styles.', 360, 32);
        Phaser.DebugUtils.context.fillText('Current style: ' + style, 360, 48);
    }
    function lockonFollow() {
        game.camera.follow(ufo, Phaser.Phaser.Types.CAMERA_FOLLOW_LOCKON);
        style = 'STYLE_LOCKON';
    }
    function platformerFollow() {
        game.camera.follow(ufo, Phaser.Phaser.Types.CAMERA_FOLLOW_PLATFORMER);
        style = 'STYLE_PLATFORMER';
    }
    function topdownFollow() {
        game.camera.follow(ufo, Phaser.Phaser.Types.CAMERA_FOLLOW_TOPDOWN);
        style = 'STYLE_TOPDOWN';
    }
    function topdownTightFollow() {
        game.camera.follow(ufo, Phaser.Phaser.Types.CAMERA_FOLLOW_TOPDOWN_TIGHT);
        style = 'STYLE_TOPDOWN_TIGHT';
    }
})();
