/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    function init() {
        game.load.spritesheet('item', 'assets/buttons/number-buttons-90x90.png', 90, 90);
        game.load.image('reviveBtn', 'assets/buttons/revive-button.png');
        game.load.start();
    }
    function create() {
        // Add some items.
        var item: Phaser.Sprite;
        for (var i = 0; i < 3; i++) {
            // Give the items a different alpha increase speed.
            item = game.add.sprite(290, 98 * (i + 1), 'item', i);
            // Enable input.
            item.input.start(0, false, true);
            item.events.onInputUp.add(kill);
            // An item besides the left one.
            item = game.add.sprite(388, 98 * (i + 1), 'item', i + 3);
            item.input.start(0, false, true);
            item.events.onInputUp.add(kill);
        }
        // Add a button to revive all the items.
        game.add.button(270, 400, 'reviveBtn', reviveAll, this, 0, 0, 0);
    }
    function kill(item) {
        item.kill();
    }
    function reviveAll() {
        game.world.group.callAll('revive');
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Tap or click an item to kill it, and press the revive button to revive them all.', 160, 500);
    }
})();
