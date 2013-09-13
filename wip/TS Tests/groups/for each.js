/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    var baseAlphaIncSpeed = 0.006;

    function init() {
        game.load.spritesheet('item', 'assets/buttons/number-buttons-90x90.png', 90, 90);
        game.load.start();
    }
    function create() {
        // Add some items.
        for (var i = 0; i < 3; i++) {
            game.add.sprite(290, 98 * (i + 1), 'item', i)
                .alphaIncSpeed = baseAlphaIncSpeed * (i + 1);
            game.add.sprite(388, 98 * (i + 1), 'item', i + 3)
                .alphaIncSpeed = baseAlphaIncSpeed * (i + 4);
        }
    }
    function update() {
        // Animating alpha property of each item using forEach() method.
        game.world.group.forEach(function(item) {
            // Update alpha first.
            item.alpha -= item.alphaIncSpeed;
            // Check for switch between increasing and descreasing.
            if (item.alpha < 0.001 || item.alpha > 0.999) {
                item.alphaIncSpeed *= -1;
            }
        });
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Alpha of items is always changing.', 280, 480);
    }
})();
