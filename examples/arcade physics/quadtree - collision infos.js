
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('ship', 'assets/sprites/xenon2_ship.png');
    game.load.image('baddie', 'assets/sprites/space-baddie.png');

}

var ship;
var aliens;

function create() {

    aliens = game.add.group();
    aliens.enableBody = true;

    for (var i = 0; i < 50; i++)
    {
        var s = aliens.create(game.world.randomX, game.world.randomY, 'baddie');
        s.body.collideWorldBounds = true;
        s.body.bounce.set(1);
        s.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
    }

    ship = game.add.sprite(400, 400, 'ship');
    game.physics.enable(ship, Phaser.Physics.ARCADE);
    ship.body.collideWorldBounds = true;
    ship.body.bounce.set(1);

}

function update() {

    game.physics.arcade.collide(ship, aliens);

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        ship.body.velocity.x -= 4;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        ship.body.velocity.x += 4;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        ship.body.velocity.y -= 4;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
        ship.body.velocity.y += 4;
    }

}

function render() {

    game.debug.quadTree(game.physics.arcade.quadTree);

}
