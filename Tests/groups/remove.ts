/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    // Group contains items.
    var items: Phaser.Group;

    function init() {
        game.load.spritesheet('item', 'assets/buttons/number-buttons-90x90.png', 90, 90);
        game.load.image('rect', 'assets/tests/200x100corners.png');
        game.load.image('rect2', 'assets/tests/200x100corners2.png');
        game.load.start();
    }
    function create() {
        // Create item container group.
        items = game.add.group();

        // Add some items and add them to the container group,
        // then you can drag and drop them to remove.
        var item: Phaser.Sprite;
        for (var i = 0; i < 6; i++) {
            // Directly create sprites from the group.
            item = items.addNewSprite(90, 90 * i, 'item', i, Phaser.Types.BODY_DISABLED);
            // Enable input detection, then it's possible be dragged.
            item.input.start(0, false, true);
            // Make this item draggable.
            item.input.enableDrag();
            // Then we make it snap to 90x90 grids.
            item.input.enableSnap(90, 90, false, true);
            // Add a handler to remove it using different options when dropped.
            item.events.onDragStop.add(dropHandler);
        }

        // Create 2 rectangles, drop it at these rectangle to
        // remove it from origin group normally or
        // cut it from the group's array entirely.
        var rect: Phaser.Sprite = game.add.sprite(400, 0, 'rect');
        rect.transform.scale.setTo(2.0, 3.0);
        var rect2: Phaser.Sprite = game.add.sprite(400, 300, 'rect2');
        rect2.transform.scale.setTo(2.0, 3.0);
    }
    function update() {
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Size of group: ' + items.length, 100, 560);
        Phaser.DebugUtils.context.fillText('Drop here to cut items from groups entirely.', 450, 24);
        Phaser.DebugUtils.context.fillText('Drop here to remove it normally.', 450, 324);
    }
    function dropHandler(item, pointer) {
        if (item.x < 90) {
            item.x = 90;
        }
        else if (item.x > 400) { // So it is dropped in one rectangle.
            if (item.y < 300) {
                // Remove it from group normally, so the group's size does not change.
                items.remove(item, true);
            }
            else {
                // Remove it from group and cut from it, so the group's size decreases.
                items.remove(item);
            }
        }
    }
})();
