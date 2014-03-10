
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('ship', 'assets/sprites/xenon2_ship.png');
    game.load.image('baddie', 'assets/sprites/space-baddie.png');
}

var ship;
var aliens;

function create() {

    aliens = game.add.group();

    for (var i = 0; i < 50; i++)
    {
        var s = aliens.create(game.world.randomX, game.world.randomY, 'baddie');
        game.physics.enable(s, Phaser.Physics.ARCADE);
        s.name = 'alien' + s;
        s.body.collideWorldBounds = true;
        s.body.bounce.setTo(1, 1);
        s.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
    }

    ship = game.add.sprite(400, 400, 'ship');
    game.physics.enable(ship, Phaser.Physics.ARCADE);
    ship.body.collideWorldBounds = true;
    ship.body.bounce.setTo(1, 1);

}

function update() {

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        ship.body.velocity.x -= 2;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        ship.body.velocity.x += 2;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        ship.body.velocity.y -= 2;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
        ship.body.velocity.y += 2;
    }

    game.physics.arcade.collide(ship, aliens);

}

function render() {

    game.debug.QuadTree(game.physics.arcade.quadTree);
    game.debug.geom(ship.body);

    // game.debug.text('total: ' + total.length, 32, 50);

    game.debug.text('up: ' + ship.body.touching.up, 32, 70);
    game.debug.text('down: ' + ship.body.touching.down, 32, 90);
    game.debug.text('left: ' + ship.body.touching.left, 32, 110);
    game.debug.text('right: ' + ship.body.touching.right, 32, 130);

}
