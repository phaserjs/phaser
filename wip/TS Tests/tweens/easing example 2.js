/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create);

    function init() {
        game.load.spritesheet('shadow', 'assets/tests/tween/shadow.png', 80, 15);
        game.load.spritesheet('PHASER', 'assets/tests/tween/PHASER.png', 70, 90);
        game.load.start();
    }
    function create() {
        var item;
        for (var i = 0; i < 6; i++) {
            item = game.add.sprite(190 + 69 * i, -100, 'PHASER', i);
            // Add a simple bounce tween to each character's position.
            game.add.tween(item)
                .to({y: 240}, 2400, Phaser.Easing.Bounce.Out, true, 1000 + 400 * i, false);
            // Add another rotation tween to the same character.
            // Notice that depends on the default origin setting, characters will
            // rotate around the left-top corner which looks a little strange.
            game.add.tween(item)
                .to({rotation: 360}, 2400, Phaser.Easing.Cubic.In, true, 1000 + 400 * i, false);
        }

        // Set background color to white.
        game.stage.backgroundColor = '#fff';
    }
})();
