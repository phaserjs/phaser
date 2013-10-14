<?php
    $title = "Rectangle";
    require('../head.php');
?>

<script type="text/javascript">



    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {create: create});

    function create() {

        var graphics = game.add.graphics(50,50);

        // set a fill and line style
        graphics.beginFill(0xFF0000);
        graphics.lineStyle(10, 0xFF0000, 1);
        
        // draw a shape
        graphics.moveTo(50,50);
        graphics.lineTo(250, 50);
        graphics.endFill();
    }



</script>

<?php
    require('../foot.php');
?>