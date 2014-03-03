
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('wasp', 'assets/sprites/wasp.png');
    game.load.image('sky', 'assets/skies/cavern1.png');

}

var bugs;
var index = 0;
var data;
var pos = [];

function create() {

    game.add.image(0, 0, 'sky');

    // image = game.add.image(0, 0, 'wasp');

    //  We don't want it to actually run, so we use game.make.tween instead of game.add.tween

    var tweenData = { x: 0, y: 0 };

    //  Here we'll tween the values held in the tweenData object to x: 500, y: 300
    tween = game.make.tween(tweenData).to( { x: 100, y: 400 }, 2000, Phaser.Easing.Sinusoidal.InOut);

    //  Set the tween to yoyo so it loops smoothly
    tween.yoyo(true);

    //  We have 3 interpolation methods available: linearInterpolation (the default), bezierInterpolation and catmullRomInterpolation.

    // tween.interpolation(game.math.bezierInterpolation);
    tween.interpolation(game.math.catmullRomInterpolation);

    //  Generates the tween data at a rate of 60 frames per second.
    //  This is useful if you've got a lot of objects all using the same tween, just at different coordinates.
    //  It saves having to calculate the same tween across the properties of all objects involved in the motion.
    //  Instead you can pre-calculate it in advance and trade that in for a bit of memory to store it in an array.
    data = tween.generateData(60);

    //  Now create some sprites to shown the tween data in action
    bugs = game.add.group();

    pos.push(new Phaser.Point(32, 0));
    pos.push(new Phaser.Point(300, 100));
    pos.push(new Phaser.Point(600, 70));

    bugs.create(pos[0].x, pos[0].y, 'wasp');
    bugs.create(pos[1].x, pos[1].y, 'wasp');
    bugs.create(pos[2].x, pos[2].y, 'wasp');

}

function update() {

    //  A simple data playback.

    //  Each element of the array contains an object that includes whatever properties were tweened
    //  In this case the x and y properties

    //  Because the tween data is pre-generated we can apply it however we want:
    //  Directly, by adding to the coordinates
    bugs.getAt(0).x = pos[0].x + data[index].x;
    bugs.getAt(0).y = pos[0].y + data[index].y;

    //  Half one of the values
    bugs.getAt(1).x = pos[1].x + (data[index].x / 2);
    bugs.getAt(1).y = pos[1].y + data[index].y;

    //  Inverse one of the values
    bugs.getAt(2).x = pos[2].x - data[index].x;
    bugs.getAt(2).y = pos[2].y + data[index].y;

    //  You can do all kinds of effects by modifying the tween data,
    //  without having loads of active tweens running.

    //  This just advances the tween data index
    //  It's crude and doesn't take target device speed into account at all, but works as an example
    index++;

    if (index === data.length)
    {
        index = 0;
    }

}
