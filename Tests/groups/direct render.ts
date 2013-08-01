/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    // Left and right group.
    var left:: Phaser.Group, right: Phaser.Group;
    // The first selected item.
    var selected: Phaser.Sprite = null;

    function init() {
        game.load.spritesheet('item', 'assets/buttons/number-buttons-90x90.png', 90, 90);
        game.load.start();
    }
    function create() {
        left = game.add.group();
        right = new Phaser.Group(game);
        // Add some items to left side, and set a onDragStop listener
        // to limit its location when dropped.
        var item: Phaser.Sprite;
        for (var i = 0; i < 3; i++) {
            // Directly create sprites from the left group.
            item = left.addNewSprite(250, 98 * (i + 1), 'item', i, Phaser.Types.BODY_DISABLED);
            // Add another to the right group.
            item = right.addNewSprite(348, 98 * (i + 1), 'item', i + 3, Phaser.Types.BODY_DISABLED);
        }

        exCamera = game.add.camera(0, 0, 800, 600);
        exCamera.setPosition(120, 0);
    }
    function render() {
        right.directRender(exCamera);

        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Left Group', 300, 80);
        Phaser.DebugUtils.context.fillText('Right Group', 400, 80);
        Phaser.DebugUtils.context.fillText('Left group is normally rendered, while the right one is ONLY rendered directly to another camera.', 120, 480);
    }
})();
