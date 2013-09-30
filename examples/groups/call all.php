 
 <?php
    $title = "Calling a function on all members of the group";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create,render : render });

    function preload() {
        game.load.spritesheet('item', 'assets/buttons/number-buttons-90x90.png', 90, 90);
        game.load.image('reviveBtn', 'assets/buttons/revive-button.png');
        
    }
    function create() {
        // Add some items.
        var item;
        for (var i = 0; i < 3; i++) {
            // Give the items a different alpha increase speed.
            item = game.add.sprite(290, 98 * (i + 1), 'item', i);
            // Enable input.
            item.input.start(0, true);
            item.events.onInputUp.add(kill);
            // An item besides the left one.
            item = game.add.sprite(388, 98 * (i + 1), 'item', i + 3);
            item.input.start(0, true);
            item.events.onInputUp.add(kill);
        }
        // Add a button to revive all the items.
        game.add.button(270, 400, 'reviveBtn', reviveAll, this, 0, 0, 0);
    }
    function kill(item) {
        item.kill();
    }
    function reviveAll() {
        game.world.group.callAll('revive');
    }
    function render() {

        game.debug.renderText('Tap or click an item to kill it, and press the revive button to revive them all.', 160, 500);
    }

})();

</script>

<?php
    require('../foot.php');
?>
