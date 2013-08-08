/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create);

    function preload() {
        game.load.spritesheet('shadow', 'assets/tests/tween/shadow.png', 80, 15);
        game.load.spritesheet('PHASER', 'assets/tests/tween/PHASER.png', 70, 90);
        
    }
    function create() {
        var item: Phaser.Sprite,
            tween: Phaser.Tween;
        for (var i = 0; i < 6; i++) {
            item = game.add.sprite(190 + 69 * i, -100, 'PHASER', i);
            // Add a simple bounce tween to each character's position.
            tween = game.add.tween(item)
                .to({y: 240}, 2400, Phaser.Easing.Bounce.Out, true, 1000 + 400 * i, false);
            // Chain another tween to the character after it falls down.
            tween.chain(
                game.add.tween(item)
                    .to({y: 640}, 1400, Phaser.Easing.Circular.In, false, 0, false)
            );
        }

        // Set background color to white.
        game.stage.backgroundColor = '#fff';
    }
})();
