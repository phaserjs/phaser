/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    var baseIncSpeed = 0.006;

    function init() {
        game.load.spritesheet('item', 'assets/buttons/number-buttons-90x90.png', 90, 90);
        game.load.start();
    }
    function create() {
        // Add some items.
        for (var i = 0; i < 3; i++) {
            // Give the items a different alpha increase speed.
            game.add.sprite(290, 98 * (i + 1), 'item', i)
                .alphaIncSpeed = baseIncSpeed * (i + 1);
            game.add.sprite(388, 98 * (i + 1), 'item', i + 3)
                .alphaIncSpeed = baseIncSpeed * (i + 4);
        }

        game.input.onTap.add(resetAlpha);
    }
    function resetAlpha() {
        // Set "alpha" value of all the childs.
        game.world.group.setAll('alpha', Math.random());
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Tap or click to set random alpha of all the items.', 240, 480);
    }
})();
