/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create);

    function preload() {
        game.load.spritesheet('shadow', 'assets/tests/tween/shadow.png', 138, 15);
        game.load.spritesheet('PHASER', 'assets/tests/tween/PHASER.png', 70, 90);
        
    }
    function create() {
        var item: Phaser.Sprite,
            shadow: Phaser.Sprite,
            tween: Phaser.Tween;
        for (var i = 0; i < 6; i++) {
            // Add a shadow to the location which characters will land on.
            // And tween their size to make them look like a real shadow.
            // Put the following code before items to give shadow a lower
            // render order.
            shadow = game.add.sprite(190 + 69 * i, 284, 'shadow');
            // Set shadow's size 0 so that it'll be invisible at the beginning.
            shadow.transform.scale.setTo(0.0, 0.0);
            // Also set the origin to the center since we don't want to
            // see the shadow scale to the left top.
            shadow.transform.origin.setTo(0.5, 0.5);
            game.add.tween(shadow.transform.scale)
                .to({x: 1.0, y: 1.0}, 2400, Phaser.Easing.Bounce.Out, true, 1000 + 400 * i, false);

            // Add characters on top of shadows.
            item = game.add.sprite(190 + 69 * i, -100, 'PHASER', i);
            // Set origin to the center to make the rotation look better.
            item.transform.origin.setTo(0.5, 0.5);
            // Add a simple bounce tween to each character's position.
            tween = game.add.tween(item)
                .to({y: 240}, 2400, Phaser.Easing.Bounce.Out, true, 1000 + 400 * i, false);
        }

        // Set background color to white.
        game.stage.backgroundColor = '#fff';
    }
})();
