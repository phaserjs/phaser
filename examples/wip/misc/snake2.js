var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('snake','assets/games/snake/sprites.png', 32, 32);
    game.load.image('ball', 'assets/sprites/pangball.png');

}

var snake;

var snakeHead; //head of snake sprite
var snakePath = []; //arrary of positions(points) that have to be stored for the path the sections follow
var numSnakeSections = 10; //number of snake body sections
var snakeSpacer = 6; //parameter that sets the spacing between sections
var snakeSpeed = 250;
var snakeLength = 10;

var fruit;

var snakeCircles = [];
var node;
var ball;

function create() {

    game.world.setBounds(0, 0, 800, 600);

    game.stage.backgroundColor = '#0f4e93';

    cursors = game.input.keyboard.createCursorKeys();

    snake = game.add.group();

    snakeHead = snake.create(400, 300, 'snake', 5);
    snakeHead.anchor.setTo(0.5, 0.5);
    snakeHead.animations.add('chomp', [5, 6], 10, true);
    snakeHead.play('chomp');
    snakeHead.body.collideWorldBounds = true;
    snakeCircles.push(new Phaser.Circle(snakeHead.x, snakeHead.y, 16));
    
    //  Init snakeSection array
    for (var i = 1; i <= numSnakeSections-1; i++)
    {
        var snakeSection = snake.create(400, 300, 'snake', 7);
        snakeSection.anchor.setTo(0.5, 0.5);
        snakeSection.animations.add('walk', [7, 8, 9, 10], 10, true);
        snakeSection.play('walk');
        snakeCircles.push(new Phaser.Circle(400, 300, 16));

        if (i > snakeLength)
        {
            snakeSection.visible = false;
        }
    }

    node = new Phaser.Circle(300, 300, 170);
    ball = game.add.sprite(node.x, node.y, 'ball');
    ball.anchor.setTo(0.5, 0.5);

    // fruit = game.add.group();

    // for (var i = 0; i < 20; i++)
    // {
    //     fruit.create(game.world.randomX, game.world.randomY, 'snake', 2);
    // }
    
    //  Init snakePath array
    for (var i = 0; i <= numSnakeSections * snakeSpacer; i++)
    {
        snakePath[i] = new Phaser.Point(400, 300);
    }

}

function newNode() {

    node.x = game.rnd.integerInRange(100, 700);
    node.y = game.rnd.integerInRange(100, 500);
    ball.x = node.x;
    ball.y = node.y;
    ball.alpha = 1;

}

function update() {

    // game.physics.collide(snakeHead, fruit, eatFruit);

    var enclosed = true;

    for (var i = 0; i <= numSnakeSections - 1; i++)
    {
        if (Phaser.Circle.intersects(snakeCircles[i], node) === false)
        {
            enclosed = false;
            break;
        }
    }

    if (enclosed)
    {
        ball.alpha -= 0.02;

        if (ball.alpha <= 0)
        {
            newNode();
        }
    }

    snakeHead.body.angularVelocity = 0;
    
    // if (cursors.up.isDown)
    // {
        snakeHead.body.velocity.copyFrom(game.physics.velocityFromAngle(snakeHead.angle, snakeSpeed));

        snakeCircles[0].x = snakeHead.x;
        snakeCircles[0].y = snakeHead.y;

        var part = snakePath.pop();

        part.setTo(snakeHead.x, snakeHead.y);

        snakePath.unshift(part);

        for (var i = 1; i <= numSnakeSections - 1; i++)
        {
            var x = (snakePath[i * snakeSpacer]).x;
            var y = (snakePath[i * snakeSpacer]).y;
            snake.getAt(i).x = x;
            snake.getAt(i).y = y;
            snakeCircles[i].x = x;
            snakeCircles[i].y = y;
        }
    // }

    if (cursors.left.isDown)
    {
        snakeHead.body.angularVelocity = -220;
    }
    else if (cursors.right.isDown)
    {
        snakeHead.body.angularVelocity = 220;
    }

}

function eatFruit(snakeHead, fruit) {

    fruit.kill();

    snakeLength++;

    snake.getAt(snakeLength).visible = true;
    snakeSpeed += 10;

}

function render() {

    //game.debug.circle(node);

    for (var i = 0; i <= numSnakeSections - 1; i++)
    {
        //game.debug.circle(snakeCircles[i], 'rgb(255,0,0)');
    }


}