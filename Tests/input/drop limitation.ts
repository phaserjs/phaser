/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    function init() {
        game.load.spritesheet('item', 'assets/buttons/number-buttons-90x90.png', 90, 90);
        game.load.start();
    }
    function create() {
        // Add some items to left side, and set a onDragStop listener
        // to limit its location when dropped.
        var item: Phaser.Sprite;
        for (var i = 0; i < 6; i++) {
            // Directly create sprites from the left group.
            item = game.add.sprite(90, 90 * i, 'item', i);
            // Enable input detection, then it's possible be dragged.
            item.input.start(0, false, true);
            // Make this item draggable.
            item.input.enableDrag();
            // Then we make it snap to left and right side,
            // also make it only snaps when released.
            item.input.enableSnap(90, 90, false, true);
            // Limit drop location to only the 2 columns.
            item.events.onDragStop.add(fixLocation);
        }
    }
    function update() {
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Group Left.', 100, 560);
        Phaser.DebugUtils.context.fillText('Group Right.', 280, 560);
    }
    function fixLocation(item) {
        // Move the items when it is already dropped.
        if (item.x < 90) {
            item.x = 90;
        }
        else if (item.x > 180 && item.x < 270) {
            item.x = 180;
        }
        else if (item.x > 360) {
            item.x = 270;
        }
    }
})();
