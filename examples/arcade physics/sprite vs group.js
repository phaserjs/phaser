
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('phaser', 'assets/sprites/phaser-dude.png');
    game.load.spritesheet('veggies', 'assets/sprites/fruitnveg32wh37.png', 32, 32);

}

var sprite;
var group;
var cursors;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    //  This example will check Sprite vs. Group collision

    sprite = game.add.sprite(32, 200, 'phaser');
    sprite.name = 'phaser-dude';
    

    group = game.add.group();

    game.physics.enable(game.world, Phaser.Physics.ARCADE);

    for (var i = 0; i < 50; i++)
    {
        var c = group.create(game.rnd.integerInRange(100, 770), game.rnd.integerInRange(0, 570), 'veggies', game.rnd.integerInRange(0, 36));
        c.name = 'veg' + i;
        game.physics.enable(c, Phaser.Physics.ARCADE);
        c.body.immovable = true;
    }

    for (var i = 0; i < 20; i++)
    {
        //  Here we'll create some chillis which the player can pick-up. They are still part of the same Group.
        var c = group.create(game.rnd.integerInRange(100, 770), game.rnd.integerInRange(0, 570), 'veggies', 17);
        c.name = 'chilli' + i;
        game.physics.enable(c, Phaser.Physics.ARCADE);
        c.body.immovable = true;
    }

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    game.physics.arcade.collide(sprite, group, collisionHandler, null, this);
    game.physics.arcade.collide(group, group);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -200;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 200;
    }

    if (cursors.up.isDown)
    {
        sprite.body.velocity.y = -200;
    }
    else if (cursors.down.isDown)
    {
        sprite.body.velocity.y = 200;
    }

}

function collisionHandler (player, veg) {

    //  If the player collides with the chillis then they get eaten :)
    //  The chilli frame ID is 17

    if (veg.frame == 17)
    {
        veg.kill();
    }

}

