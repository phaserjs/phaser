 
 <?php
    $title = "Bring to Top using parent container";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create,render : render });

    var container;

    function preload() {
        game.load.spritesheet('button', 'assets/buttons/number-buttons.png', 160, 160);
        
    }
    function create() {
        // Container for sorting the buttons, which we'll use to make buttons
        // to the top later.
        container = game.add.group();

        // Add buttons to container.
        container.add(game.add.button(200, 100, 'button', bringMeToTop, this, 0, 0, 0));
        container.add(game.add.button(300, 100, 'button', bringMeToTop, this, 1, 1, 1));
        container.add(game.add.button(100, 200, 'button', bringMeToTop, this, 2, 2, 2));
        container.add(game.add.button(400, 200, 'button', bringMeToTop, this, 3, 3, 3));
        container.add(game.add.button(300, 300, 'button', bringMeToTop, this, 4, 4, 4));
        container.add(game.add.button(200, 300, 'button', bringMeToTop, this, 5, 5, 5));
    }
    function render() {

       game.debug.renderText('Tap or click buttons to bring it to the top.', 32, 32);
    }
    function bringMeToTop(btn) {
        container.bringToTop(btn);
    }



</script>

<?php
    require('../foot.php');
?>
