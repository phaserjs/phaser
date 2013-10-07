<?php
    $title = "Using LinkedLists";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create });

    function preload() {
        game.load.image('alien', 'assets/sprites/space-baddie.png');
        game.load.image('ship', 'assets/sprites/shmup-ship.png');
    }

    var a;
    var b;
    var c;
    var d;
    var e;
    var f;

    var list;

    function create() {

        a = game.add.sprite(100, 100, 'ship');
        a.name = 's1';
        b = game.add.sprite(130, 100, 'ship');
        b.name = 's2';
        c = game.add.sprite(160, 100, 'ship');
        c.name = 's3';
        d = game.add.sprite(190, 100, 'alien');
        d.name = 'a1';
        e = game.add.sprite(220, 100, 'alien');
        e.name = 'a2';
        f = game.add.sprite(250, 100, 'alien');
        f.name = 'a3';

        list = new Phaser.LinkedList();

        list.add(a.input);
        list.add(b.input);
        list.add(c.input);
        list.add(d.input);
        list.add(e.input);
        list.add(f.input);

    }

})();

</script>

<?php
    require('../foot.php');
?>

