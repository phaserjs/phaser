/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, null, render);

    var friendAndFoe: Phaser.Group,
        enemies: Phaser.Group;

    function preload() {
        game.load.image('ufo', 'assets/sprites/ufo.png');
        game.load.image('baddie', 'assets/sprites/space-baddie.png');
        game.load.spritesheet('button', 'assets/buttons/baddie-buttons.png', 224, 70);
        
    }
    function create() {
        // Create some local groups for later use.
        friendAndFoe = game.add.group();
        enemies = game.add.group();

        // Create a ufo.
        friendAndFoe.addNewSprite(200, 240, 'ufo', null, Phaser.Types.BODY_DISABLED);

        // Create some enemies.
        for (var i = 0; i < 8; i++) {
            createBaddie();
        }

        // Create buttons to create and kill baddies.
        game.add.button(16, 50, 'button', createBaddie, 0, 0, 0);
        game.add.button(16, 130, 'button', killBaddie, 1, 1, 1);
    }
    function killBaddie() {
        var baddie: Phaser.Sprite = enemies.getFirstAlive();
        if (baddie) baddie.kill();
    }
    function createBaddie() {
        // Group's recycle() method will always return a valid object unless
        // you did not pass an objectClass parameter.
        // It will create new object instance of the given class if no "dead"
        // object can be found inside the group.
        var enemy: Phaser.Sprite = enemies.recycle(Phaser.Sprite);
        enemy.texture.loadImage('baddie', false);
        enemy.texture.opaque = false;
        enemy.x = 360 + Math.random() * 200;
        enemy.y = 120 + Math.random() * 200;
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Add new baddies using recyle() instead of allocating new object every time.', 16, 24);
    }
})();
