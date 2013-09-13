/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);
    function init() {
        game.load.image('ufo', 'assets/sprites/ufo.png');
        game.load.image('baddie', 'assets/sprites/space-baddie.png');
        game.load.spritesheet('button', 'assets/buttons/baddie-buttons.png', 224, 70);
        game.load.start();
    }
    function create() {
        // Create some local groups for later use.
        friendAndFoe = game.add.group();
        enemies = game.add.group();

        // Create a ufo.
        friendAndFoe.addNewSprite(200, 240, 'ufo', null, Phaser.Types.BODY_DISABLED);

        // Create some enemies.
        for (var i = 0; i < 8; i++) {
            // Since the getFirstAvailable() which we'll use for recycling
            // cannot allocate new objects, create them manually here.
            enemies.addNewSprite(360 + Math.random() * 200, 120 + Math.random() * 200,
                'baddie', null, Phaser.Types.BODY_DISABLED);
        }

        // Create buttons to create and kill baddies.
        game.add.button(16, 50, 'button', createBaddie, 0, 0, 0);
        game.add.button(16, 130, 'button', killBaddie, 1, 1, 1);
    }
    function killBaddie() {
        var baddie = enemies.getFirstAlive();
        if (baddie) baddie.kill();
    }
    function createBaddie() {
        // Recycle using getFirstAvailable() as an alternative to recycle().
        // Notice that this method will not create new objects if there's no one
        // available, and it won't change size of this group.
        var enemy = enemies.getFirstAvailable();
        if (enemy) {
            enemy.revive();
        }
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Recycle baddies from a group using getFirstAvailable() instead of recycle().', 16, 24);
        Phaser.DebugUtils.context.fillText('Notice that you cannot add more than 8 baddies since we only create 8 instance.', 16, 36);
        Phaser.DebugUtils.context.fillText('Living baddies: ' + enemies.countLiving(), 340, 420);
    }
})();
