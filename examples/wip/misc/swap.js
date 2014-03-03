var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('phaser', 'assets/sprites/phaser-dude.png');
    game.load.spritesheet('veggies', 'assets/sprites/fruitnveg32wh37.png', 32, 32);

}

var group;
var start = false;
var swapCount = 0;
var time = 0;
var test = 0;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    group = game.add.group();

    for (var i = 0; i < 500; i++)
    {
        var c = group.create(game.world.randomX, game.world.randomY, 'veggies', game.rnd.integerInRange(0, 36));
        c.name = 'veg' + i;
    }

    test = group.length;

    game.input.onUp.add(toggleSwap, this);

}

function toggleSwap () {

    if (start)
    {
        start = false;
    }
    else
    {
        start = true;
    }

}

function update() {

    if (start && game.time.now > time)
    {
        var a = group.getRandom();
        var b = group.getRandom();

        if (a.name !== b.name)
        {
            // console.log('************************ NEW ROUND *********************');
            // group.dump(true);
            // console.log('Group Size: ' + group.length);
            group.swap(a, b);
            swapCount++;

            if (group.length !== test)
            {
                start = false;
                console.log('************************ SHIT *********************');
                group.dump(true);
                console.log('************************ SHIT *********************');
            }

            if (group.validate() == false)
            {
                start = false;
                console.log('************************ VALIDATE FAIL *********************');
                group.dump(true);
                console.log('************************ VALIDATE FAIL *********************');
            }

        }

        // time = game.time.now + 50;
    }

}

function render() {

    game.debug.text('Swap: ' + swapCount, 32, 32);

}