/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, null, render);
    function preload() {
        game.load.image('ufo', 'assets/sprites/ufo.png');
        game.load.image('baddie', 'assets/sprites/space-baddie.png');
        
    }

    var friendAndFoe: Phaser.Group,
        enemies: Phaser.Group;

    function create() {
        // Create some local groups for later use.
        friendAndFoe = game.add.group();
        enemies = game.add.group();

        // You can directly create sprite and add it to a group
        // using just one line. (One thing you should know is, the body type
        // of this sprite is set to BODY_DINAMIC by default, while it's
        // BODY_DISABLED by default using other creating methods.)
        friendAndFoe.addNewSprite(200, 240, 'ufo', null, Phaser.Types.BODY_DISABLED);

        // Create some enemies.
        for (var i = 0; i < 8; i++) {
            createBaddie();
        }

        // Tap to create new baddie sprites.
        game.input.onTap.add(createBaddie, this);
    }
    function createBaddie() {
        enemies.addNewSprite(360 + Math.random() * 200, 120 + Math.random() * 200,
            'baddie', null,
            Phaser.Types.BODY_DISABLED);
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Tap screen or click to create new baddies.', 16, 24);
    }
})();
