
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('ball', 'assets/sprites/shinyball.png');

}

var balls;

function create() {

    balls = game.add.group();

    for (var i = 0; i < 50; i++)
    {
        var ball = balls.create(game.world.randomX, game.world.randomY, 'ball');
         game.physics.enable(ball, Phaser.Physics.ARCADE);
    }

}

function update() {

    if (game.input.mousePointer.isDown)
    {
        //  First is the callback
        //  Second is the context in which the callback runs, in this case game.physics.arcade
        //  Third is the parameter the callback expects - it is always sent the Group child as the first parameter
        balls.forEach(game.physics.arcade.moveToPointer, game.physics.arcade, false, 200);
    }
    else
    {
        balls.setAll('body.velocity.x', 0);
        balls.setAll('body.velocity.y', 0);
    }
}
