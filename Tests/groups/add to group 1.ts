/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    var friendAndFoe: Phaser.Group,
        enemies: Phaser.Group;

    function init() {
        game.load.image('ufo', 'assets/sprites/ufo.png');
        game.load.image('baddie', 'assets/sprites/space-baddie.png');
        game.load.start();
    }
    function create() {
        // Create some local groups for later use.
        friendAndFoe = game.add.group();
        enemies = game.add.group();

        // Use game.add (GameObjectFactory) to create sprites, those
        // newly created ones will be added to game.world.group
        // automatically. While you can still use new to allocate and
        // only add them to your own groups.
        var ufo: Phaser.Sprite = game.add.sprite(200, 240, 'ufo');
        friendAndFoe.add(ufo);

        // Create some enemies using new keyword.
        // (Don't forget to pass game as the first parameter.)
        var enemy;
        for (var i = 0; i < 16; i++) {
            enemy = new Phaser.Sprite(game,
                360 + Math.random() * 200, 120 + Math.random() * 200,
                'baddie');
            enemies.add(enemy);
        }
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('ufo added to game.world.group and "friendAndFoe" group', 16, 24);
        Phaser.DebugUtils.context.fillText('others ONLY added to "enemies" group', 16, 40);
    }
})();
