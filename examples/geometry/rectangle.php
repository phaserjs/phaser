<?php
    $title = "Rectangle";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {create: create,render:render});

    var floor;

    function create() {

        //  A simple floor
        floor = new Phaser.Rectangle(0, 550,800,50);
    }

    function render () {
        game.debug.renderRectangle(floor,'#0fffff');
    }



</script>

<?php
    require('../foot.php');
?>