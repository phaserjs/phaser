/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    // Groups for storing friends and enemies, may use for collision later.
    var friendAndFoe: Phaser.Group,
        enemies: Phaser.Group;

    // Groups for teaming up stuff.
    var normalBaddies: Phaser.Group,
        purpleBaddies: Phaser.Group;

    function init() {
        game.load.image('ufo', 'assets/sprites/ufo.png');
        game.load.image('baddie', 'assets/sprites/space-baddie.png');
        game.load.image('purple-baddie', 'assets/sprites/space-baddie-purple.png');
        game.load.start();
    }
    function create() {
        // Create some local groups for later use.
        friendAndFoe = game.add.group();
        enemies = game.add.group();
        normalBaddies = game.add.group();
        purpleBaddies = game.add.group();

        // Add both teams to enemies group.
        enemies.add(normalBaddies);
        enemies.add(purpleBaddies);

        // Create a ufo as a friend sprite.
        friendAndFoe.addNewSprite(200, 240, 'ufo', null, Phaser.Types.BODY_DISABLED);

        // Create some enemies.
        for (var i = 0; i < 16; i++) {
            createBaddie();
        }

        // Tap to create new baddie sprites.
        game.input.onTap.add(createBaddie, this);
    }
    function createBaddie() {
        var baddie: Phaser.Sprite;
        if (Math.random() > 0.5) {
            baddie = purpleBaddies.addNewSprite(360 + Math.random() * 200, 120 + Math.random() * 200,
                'purple-baddie', null, Phaser.Types.BODY_DISABLED);
        }
        else {
            baddie = normalBaddies.addNewSprite(360 + Math.random() * 200, 120 + Math.random() * 200,
                'baddie', null, Phaser.Types.BODY_DISABLED);
        }
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Tap screen or click to create new baddies.', 16, 24);
        Phaser.DebugUtils.context.fillText('enemies: ' + enemies.length + ' (actually ' + enemies.length + ' groups)', 16, 48);
        Phaser.DebugUtils.context.fillText('normal baddies: ' + normalBaddies.length, 16, 60);
        Phaser.DebugUtils.context.fillText('purple baddies: ' + purpleBaddies.length, 16, 72);
        Phaser.DebugUtils.context.fillText('friends: ' + friendAndFoe.length, 16, 96);
    }
})();
