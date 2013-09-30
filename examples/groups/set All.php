 
 <?php
    $title = "Setting properies of all children";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create,render:render});

     var baseIncSpeed= 0.006;

    function preload() {
        game.load.spritesheet('item', 'assets/buttons/number-buttons-90x90.png', 90, 90);
        
    }
    function create() {
        // Add some items.
        for (var i = 0; i < 3; i++) {
            // Give the items a different alpha increase speed.
            game.add.sprite(290, 98 * (i + 1), 'item', i)
                .alphaIncSpeed = baseIncSpeed * (i + 1);
            game.add.sprite(388, 98 * (i + 1), 'item', i + 3)
                .alphaIncSpeed = baseIncSpeed * (i + 4);
        }

        game.input.onTap.add(resetAlpha,this);
    }
    function resetAlpha() {
        // Set "alpha" value of all the childs.
        game.world.group.setAll('alpha', Math.random());
    }
    function render() {

        game.debug.renderText('Tap or click to set random alpha of all the items.', 240, 480);
    }

})();

</script>

<?php
    require('../foot.php');
?>
