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

//  Here is a custom game object
MonsterBunny = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'bunny');

};

MonsterBunny.prototype = Phaser.Utils.extend(true, Phaser.Sprite.prototype, PIXI.Sprite.prototype);
MonsterBunny.prototype.constructor = MonsterBunny;

/**
 * Automatically called by World.update
 */
MonsterBunny.prototype.update = function() {

    this.angle++;

};

(function () {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

    function preload() {

        game.load.image('bunny', 'assets/sprites/bunny.png');

    }

    function create() {

        var wabbit = new MonsterBunny(game, 400, 300);
        wabbit.lifespan = 3000;
        wabbit.anchor.setTo(0.5, 0.5);

        game.add.existing(wabbit);

    }

})();
</script>

</body>
</html>