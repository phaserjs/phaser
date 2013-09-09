<!DOCTYPE HTML>
<html>
<head>
    <title>phaser.js - a new beginning</title>
    <?php
        require('js.php');
    ?>
</head>
<body>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, render: render });

    function preload() {

        game.load.image('beast', 'assets/pics/shadow_of_the_beast2_karamoon.png');
        game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);

    }

    var image;
    var button;

    function create() {

        game.stage.backgroundColor = 0xefefef;

        //  This is just an image that we'll toggle the display of when you click the button
        image = game.add.sprite(game.world.centerX, 0, 'beast');
        image.anchor.setTo(0.5, 0);

        //  This button is created from a sprite sheet.
        //  Frame 0 = the 'down' state
        //  Frame 1 = the 'out' state
        //  Frame 2 = the 'over' state
        //  The function "clickedIt" will be called when the button is clicked or touched
        button = game.add.button(game.world.centerX, 400, 'button', clickedIt, this, 2, 1, 0);

        //  Just makes the button anchor set to the middle, we only do this to center the button on-screen, no other reason
        button.anchor.setTo(0.5, 0.5);

    }

    function clickedIt() {

        if (image.visible == true)
        {
            image.visible = false;
        }
        else
        {
            image.visible = true;
        }

    }

    function render() {
    }

})();
</script>

</body>
</html>