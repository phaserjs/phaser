<?php
    $title = "Scale the game and explore it using the keyboard";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(320, 240, Phaser.CANVAS, '', { preload: preload, create: create,update:update,render:render});

    function preload() {

        //  This sets a limit on the up-scale
        game.stage.scale.maxWidth = 800;
        game.stage.scale.maxHeight = 600;

        //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
        game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;

        game.load.image('melon', 'assets/sprites/melon.png');

        

    }

    function create() {

    	//We increase the size of our game world
        game.world.setBounds(0,0,2000, 2000);

        for (var i = 0; i < 1000; i++)
        {
        	//And spread some sprites inside it
            game.add.sprite(game.world.randomX, game.world.randomY, 'melon');
        }

    }

    function update() {

    	//This allows us to move the game camera using the keyboard

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            game.camera.x -= 4;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            game.camera.x += 4;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            game.camera.y -= 4;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            game.camera.y += 4;
        }

    }

    function render() {

        game.debug.renderInputInfo(16, 16);

    }



</script>

<?php
    require('../foot.php');
?>
