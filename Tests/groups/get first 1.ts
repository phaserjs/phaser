/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update, render);

    var timer: Number,
        cycle: Number;

    function preload() {
        game.load.spritesheet('item', 'assets/buttons/number-buttons-90x90.png', 90, 90);
        game.load.image('reviveBtn', 'assets/buttons/revive-button.png');
        
    }
    function create() {
        // Add some items.
        var item: Phaser.Sprite;
        for (var i = 0; i < 3; i++) {
            // Give the items a different alpha increase speed.
            item = game.add.sprite(290, 98 * (i + 1), 'item', i);
            // An item besides the left one.
            item = game.add.sprite(388, 98 * (i + 1), 'item', i + 3);
        }

        // Set a timer so we can perform an action after a delay.
        timer = 0;
        cycle = 1000;
    }
    function update() {
        // Update timer.
        timer += game.time.delta;
        if (timer > cycle) {
            timer -= cycle;
            // Get the first alive item and kill it.
            var item = game.world.group.getFirstAlive();
            if (item) {
                item.kill();
            }
        }
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('One item will be killed each second.', 280, 420);
        // Get living and dead number of a group.
        Phaser.DebugUtils.context.fillText('Living: ' + game.world.group.countLiving() + ', Dead: ' + game.world.group.countDead(), 330, 440);
    }
})();
