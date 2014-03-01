// Snake by Patrick OReilly and Richard Davey
// Twitter: @pato_reilly Web: http://patricko.byethost9.com

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update,render : render });

function preload() {

    game.load.image('ball','assets/sprites/shinyball.png');

}

var snakeHead; //head of snake sprite
var snakeSection = new Array(); //array of sprites that make the snake body sections
var snakePath = new Array(); //arrary of positions(points) that have to be stored for the path the sections follow
var numSnakeSections = 30; //number of snake body sections
var snakeSpacer = 6; //parameter that sets the spacing between sections

function create() {

    game.world.setBounds(0, 0, 800, 600);

    cursors = game.input.keyboard.createCursorKeys();

    snakeHead = game.add.sprite(400, 300, 'ball');
    snakeHead.anchor.setTo(0.5, 0.5);
    
    //  Init snakeSection array
    for (var i = 1; i <= numSnakeSections-1; i++)
    {
        snakeSection[i] = game.add.sprite(400, 300, 'ball');
        snakeSection[i].anchor.setTo(0.5, 0.5);
    }
    
    //  Init snakePath array
    for (var i = 0; i <= numSnakeSections * snakeSpacer; i++)
    {
        snakePath[i] = new Phaser.Point(400, 300);
    }

}

function update() {

    snakeHead.body.velocity.setTo(0, 0);
    snakeHead.body.angularVelocity = 0;

    if (cursors.up.isDown)
    {
        snakeHead.body.velocity.copyFrom(game.physics.velocityFromAngle(snakeHead.angle, 300));

        // Everytime the snake head moves, insert the new location at the start of the array, 
        // and knock the last position off the end

        var part = snakePath.pop();

        part.setTo(snakeHead.x, snakeHead.y);

        snakePath.unshift(part);

        for (var i = 1; i <= numSnakeSections - 1; i++)
        {
            snakeSection[i].x = (snakePath[i * snakeSpacer]).x;
            snakeSection[i].y = (snakePath[i * snakeSpacer]).y;
        }
    }

    if (cursors.left.isDown)
    {
        snakeHead.body.angularVelocity = -300;
    }
    else if (cursors.right.isDown)
    {
        snakeHead.body.angularVelocity = 300;
    }

}

function render() {

    game.debug.renderSpriteInfo(snakeHead, 32, 32);

}