<?php
    $title = "Motion";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update,render:render});

    function preload() {
        game.load.image('fuji', 'assets/pics/atari_fujilogo.png');
    }

    var fuji,
    b;

    function create() {

        game.stage.backgroundColor = 'rgb(0,0,100)';

        fuji = game.add.sprite(game.world.centerX, game.world.centerY, 'fuji');
        fuji.anchor.setTo(0, 0.5);
        // fuji.angle = 34;

        b = new Phaser.Rectangle(fuji.center.x, fuji.center.y, fuji.width, fuji.height);

        //Remember that the sprite is rotating around its anchor
        game.add.tween(fuji).to({ angle: 360 }, 20000, Phaser.Easing.Linear.None, true, 0, true);

    }

    function update() {

        if (game.input.activePointer.justPressed()){
            fuji.centerOn(game.input.x, game.input.y);
        }

        b.x = fuji.center.x - fuji.halfWidth;
        b.y = fuji.center.y - fuji.halfHeight;

    }

    function render() {

        //Phaser.DebugUtils.renderSpriteWorldViewBounds(fuji);
        //Phaser.DebugUtils.renderSpriteBounds(fuji);
        game.debug.renderSpriteCorners(fuji);
        //Phaser.DebugUtils.renderSpriteWorldView(fuji, 32, 32);
        game.debug.renderRectangle(b, 'rgba(0,20,91,1)');

    }



</script>

<?php
    require('../foot.php');
?>

