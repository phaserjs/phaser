<?php
    $title = "Overriding the browser's default keyboard behaviour";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create,update:update,render:render });

    var ufo,
        leftBtn,
        rightBtn;
    var speed=4;

    function preload() {
        game.world.setSize(1280, 600);
        game.load.image('ground', 'assets/tests/ground-2x.png');
        game.load.image('river', 'assets/tests/river-2x.png');
        game.load.image('sky', 'assets/tests/sky-2x.png');
        game.load.image('cloud0', 'assets/tests/cloud-big-2x.png');
        game.load.image('cloud1', 'assets/tests/cloud-narrow-2x.png');
        game.load.image('cloud2', 'assets/tests/cloud-small-2x.png');

        game.load.spritesheet('button', 'assets/buttons/arrow-button.png', 112, 95);
        game.load.image('spacebar', 'assets/buttons/spacebar.png');


        game.load.image('ufo', 'assets/sprites/ufo.png');

        
    }
    function create() {
        // background images
        game.add.sprite(0, 0, 'sky')
            .scrollFactor.setTo(0, 0);
        game.add.sprite(0, 360, 'ground')
            .scrollFactor.setTo(0.5, 0.5);
        game.add.sprite(0, 400, 'river')
            .scrollFactor.setTo(1.3, 1.3);
        game.add.sprite(200, 120, 'cloud0')
            .scrollFactor.setTo(0.3, 0.3);
        game.add.sprite(-60, 120, 'cloud1')
            .scrollFactor.setTo(0.5, 0.3);
        game.add.sprite(900, 170, 'cloud2')
            .scrollFactor.setTo(0.7, 0.3);

        // Create a ufo sprite as a player.
        ufo = game.add.sprite(320, 240, 'ufo');
        ufo.anchor.setTo(0.5, 0.5);

        // Make the camera follow the ufo.
        game.camera.follow(ufo);

        // Add 2 sprite to display hold direction.
        leftBtn = game.add.sprite(160 - 112, 200, 'button', 0);
        leftBtn.scrollFactor.setTo(0, 0);
        leftBtn.alpha = 0;
        rightBtn = game.add.sprite(640 - 112, 200, 'button', 1);
        rightBtn.alpha = 0;
        rightBtn.scrollFactor.setTo(0, 0);

        // Add a sprite to display spacebar press.
        spaceBtn = game.add.sprite(400 - 112, 100, 'spacebar');
        spaceBtn.transform.scrollFactor.setTo(0, 0);
        spaceBtn.alpha = 0;

        // Prevent directions and space key events bubbling up to browser,
        // since these keys will make web page scroll which is not
        // expected.
        game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR
        ]);
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

        // 50 as a second parameter is a good choice if you are running 60FPS.
        if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR, 50)) {
            console.log('space bar pressed');
            spaceBtn.alpha = 1;
        }
        if (spaceBtn.alpha > 0) {
            spaceBtn.alpha -= 0.03;
        }
    }

    function render() {

        game.debug.renderText('Hold left/right to move the ufo.', 16, 32);
        game.debug.renderText('Direction and Space key events are stopped by Phaser now,', 16, 48);
         game.debug.renderText('so they will no longer be sent to the browser', 16, 64);
        game.debug.renderText('Now you can press UP/DOWN or SPACE to see what happened.', 16, 80);
    }


})();

</script>

<?php
    require('../foot.php');
?>

