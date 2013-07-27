/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create);

    function init() {
        game.load.spritesheet('shadow', 'assets/tests/tween/shadow.png', 80, 15);
        game.load.spritesheet('PHASER', 'assets/tests/tween/PHASER.png', 70, 90);
        game.load.start();
    }
    function create() {
        var item: Phaser.Sprite,
            tween: Phaser.Tween;
        for (var i = 0; i < 6; i++) {
            item = game.add.sprite(190 + 69 * i, -100, 'PHASER', i);
            // Set origin to the center to make the rotation look better.
            item.transform.origin.setTo(0.5, 0.5);
            // Add a simple bounce tween to each character's position.
            tween = game.add.tween(item)
                .to({y: 240}, 2400, Phaser.Easing.Bounce.Out, true, 1000 + 400 * i, false);
            // A more complex chain, add a falling and a rotating after
            // the first tween done. Notice that tween.chain(t1).chain(t2)
            // will not chain the t2 to the t1, they're both chained to
            // the tween itself so they'll start the same time.
            tween
            .chain(
                game.add.tween(item)
                    .to({y: 640}, 1400, Phaser.Easing.Circular.In, false, 0, false)
            )
            .chain(
                game.add.tween(item)
                    .to({rotation: 720}, 1600, Phaser.Easing.Cubic.Out, false, 200, false)
            );
        }

        // Set background color to white.
        game.stage.backgroundColor = '#fff';
    }
})();
