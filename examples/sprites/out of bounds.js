
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('alien', 'assets/sprites/space-baddie.png');
    game.load.image('ship', 'assets/sprites/shmup-ship.png');

}

var player;
var aliens;

function create() {

    //  We only want world bounds on the left and right
    game.physics.setBoundsToWorld();

    player = game.add.sprite(400, 500, 'ship');
    player.anchor.setTo(0.5, 0.5);

    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 10; x++)
        {
            var alien = aliens.create(200 + x * 48, y * 50, 'alien');
            alien.name = 'alien' + x.toString() + y.toString();
            alien.checkWorldBounds = true;
            alien.events.onOutOfBounds.add(alienOut, this);
            alien.body.velocity.y = 50 + Math.random() * 200;
        }
    }

}

function alienOut(alien) {

    //  Move the alien to the top of the screen again
    alien.reset(alien.x, -32);

    //  And give it a new random velocity
    alien.body.velocity.y = 50 + Math.random() * 200;

}
