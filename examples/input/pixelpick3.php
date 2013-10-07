<?php
    $title = "Test Title";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);
        game.load.image('stars', 'assets/misc/starfield.jpg');

    }

    var b;
    var camSpeed = 8;
    var s;

    function create() {

        //  Make our world big ...
        game.world.setBounds(4000, 2000);

        //  Scrolling background
        s = game.add.tileSprite(0, 0, 800, 600, 'stars');

        b = game.add.sprite(200, 200, 'mummy');
        b.anchor.setTo(0.5, 0.5);
        b.scale.setTo(6, 6);
        b.animations.add('walk');
        b.animations.play('walk', 5, true);
        b.body.velocity.setTo(50, 0);

        //  Listen for input events on this sprite
        b.inputEnabled = true;

        //  Check the pixel data of the sprite
        b.input.pixelPerfect = true;

        //  Enable the hand cursor
        b.input.useHandCursor = true;

        b.events.onInputOver.add(overSprite, this);
        b.events.onInputOut.add(outSprite, this);

    }

    function overSprite() {
        console.log('over');
    }

    function outSprite() {
        console.log('out');
    }

    function update() {

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            game.camera.x -= camSpeed;

            if (!game.camera.atLimit.x)
            {
                s.tilePosition.x += camSpeed;
            }
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            game.camera.x += camSpeed;

            if (!game.camera.atLimit.x)
            {
                s.tilePosition.x -= camSpeed;
            }
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            game.camera.y -= camSpeed;

            if (!game.camera.atLimit.y)
            {
                s.tilePosition.y += camSpeed;
            }
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            game.camera.y += camSpeed;

            if (!game.camera.atLimit.y)
            {
                s.tilePosition.y -= camSpeed;
            }
        }

    }

    function render() {

        game.debug.renderSpriteInputInfo(b, 32, 32);

    }

})();
</script>

<?php
    require('../foot.php');
?>