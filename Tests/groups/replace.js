/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    // Left and right group.
    var left, right;
    // The first selected item.
    var selected = null;

    function init() {
        game.load.spritesheet('item', 'assets/buttons/number-buttons-90x90.png', 90, 90);
        game.load.start();
    }
    function create() {
        left = game.add.group();
        right = game.add.group();
        // Add some items to left side, and set a onDragStop listener
        // to limit its location when dropped.
        var item;
        for (var i = 0; i < 3; i++) {
            // Directly create sprites from the left group.
            item = left.addNewSprite(290, 98 * (i + 1), 'item', i, Phaser.Types.BODY_DISABLED);
            // Enable input.
            item.input.start(0, false, true);
            item.events.onInputUp.add(select);
            // Add another to the right group.
            item = right.addNewSprite(388, 98 * (i + 1), 'item', i + 3, Phaser.Types.BODY_DISABLED);
            // Enable input.
            item.input.start(0, false, true);
            item.events.onInputUp.add(select);
        }
    }
    function select(item, pointer) {
        // If there's no one selected, mark it as selected.
        if (!selected) {
            selected = item;
            selected.alpha = 0.5;
        }
        else {
            // Items from different group selected, replace with each other;
            // Something like a swap action, maybe better done with
            // group.swap() method.
            if (selected.group !== item.group) {
                // Move the later selected to the first selected item's position.
                item.x = selected.x;
                item.y = selected.y;
                // Replace first selected with the second one.
                selected.group.replace(selected, item);
            }
            else {
                selected.alpha = 1;
            }

            // After checking, now clear the helper var.
            selected = null;
        }
    }
    function update() {
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Left Group', 300, 80);
        Phaser.DebugUtils.context.fillText('Right Group', 400, 80);
        Phaser.DebugUtils.context.fillText('Click an item and one from another group to replace it.', 240, 480);
    }
})();
