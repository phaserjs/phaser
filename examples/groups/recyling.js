var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

var enemies;

function preload() {

    game.load.image('baddie', 'assets/sprites/space-baddie.png');
    game.load.spritesheet('button', 'assets/buttons/baddie-buttons.png', 224, 70);
    
}

function create() {

    // Create a enemies group to store the baddies
    enemies = game.add.group();

    // Create some enemies.
    for (var i = 0; i < 8; i++)
    {
        // Since the getFirstExists() which we'll use for recycling
        // cannot allocate new objects, create them manually here.
        enemies.create(360 + Math.random() * 200, 120 + Math.random() * 200, 'baddie');
    }

    // Create buttons to create and kill baddies.
    game.add.button(16, 50, 'button', createBaddie,this, 0, 0, 0);
    game.add.button(16, 130, 'button', killBaddie,this, 1, 1, 1);

}

function killBaddie() {

    var baddie = enemies.getFirstAlive();

    if (baddie)
    {
        baddie.kill();
    }

}

function createBaddie() {

    // Recycle using getFirstExists(false)
    // Notice that this method will not create new objects if there's no one
    // available, and it won't change size of this group.
    var enemy = enemies.getFirstExists(false);

    if (enemy)
    {
        enemy.revive();
    }

}

function render() {

    game.debug.text('Recycle baddies from a group using getFirstExists.', 16, 24);
    game.debug.text('Notice that you cannot add more than 8 baddies since we only create 8 instance.', 16, 36);
    game.debug.text('Living baddies: ' + (enemies.countLiving()), 340, 420);

}
