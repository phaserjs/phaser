/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    var killTimer, reviveTimer, cycle;

    function init() {
        game.load.spritesheet('item', 'assets/buttons/number-buttons-90x90.png', 90, 90);
        game.load.image('reviveBtn', 'assets/buttons/revive-button.png');
        game.load.start();
    }
    function create() {
        // Add some items.
        var item;
        for (var i = 0; i < 3; i++) {
            // Give the items a different alpha increase speed.
            item = game.add.sprite(290, 98 * (i + 1), 'item', i);
            // An item besides the left one.
            item = game.add.sprite(388, 98 * (i + 1), 'item', i + 3);
        }

        // Set a timer so we can perform an action after a delay.
        killTimer = 0;
        // Another timer for reviving.
        reviveTimer = 0;
        cycle = 1000;
    }
    function update() {
        // Update timers.
        killTimer += game.time.delta;
        reviveTimer += game.time.delta;

        // Kill first alive item every "cycle" duration.
        if (killTimer > cycle) {
            killTimer -= cycle;
            // Get an alive item from the group and kill it.
            var item = game.world.group.getFirstAlive();
            if (item) {
                item.kill();
            }
        }
        // Revive first dead item every 1.5 "cycle" duration.
        if (reviveTimer > cycle * 1.5) {
            reviveTimer -= cycle * 1.5;
            // Get a dead item from the group and revive it.
            var item = game.world.group.getFirstDead();
            if (item) {
                item.revive();
            }
        }
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('One item will be killed each second and revived later.', 240, 420);
        // Get living and dead number of a group.
        Phaser.DebugUtils.context.fillText('Living: ' + game.world.group.countLiving() + ', Dead: ' + game.world.group.countDead(), 330, 440);
    }
})();
