
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('knightHawks', 'assets/fonts/retroFonts/KNIGHT3.png');

}

var font;
var images;
var dataV;
var dataH;
var dataH2;
var sine = 0;
var total = 24;
var posV = [];
var posH = [];
var text = [ 'phaser v2', 'this march', 'yay retro fonts!', 'shaders', 'filters', 'blend modes', 'full body physics', 'and cats', '(maybe not cats)', '------------' ];
var textIndex = 0;

function create() {

    game.stage.smoothed = true;

    font = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET6, 10, 1, 1);
    font.text = 'phaser v2';

    //  Let's create 2 sets of generated tween data - one going vertically, one going horizontally, at different speeds
    var tweenData = { x: 200, y: 64 };

    tween = game.make.tween(tweenData).to( { y: 500 }, 2000, Phaser.Easing.Sinusoidal.InOut);
    tween.yoyo(true);
    tween.interpolation(game.math.catmullRomInterpolation);
    dataV = tween.generateData(60);

    tween = game.make.tween(tweenData).to( { x: 600 }, 1500, Phaser.Easing.Sinusoidal.InOut);
    tween.yoyo(true);
    tween.interpolation(game.math.catmullRomInterpolation);
    dataH = tween.generateData(60);

    tween = game.make.tween(tweenData).to( { x: 600 }, 1500, Phaser.Easing.Elastic.InOut);
    tween.yoyo(true);
    tween.interpolation(game.math.catmullRomInterpolation);
    dataH2 = tween.generateData(60);

    images = game.add.group();

    var tmp;

    for (var i = 0; i < total; i++)
    {
        tmp = images.create(game.world.centerX, 64, font);
        tmp.anchor.set(0.5);
        tmp.scale.set(2);
        // tmp.alpha = (1.0 / total) * i;
        posV.push(i * 4);
        posH.push(i);
    }

    images.reverse();

    game.time.events.loop(4000, updateText, this);
    game.time.events.loop(6000, updateSine, this);

}

function updateSine() {

    sine++;

    if (sine === 2)
    {
        sine = 0;
    }

}

function updateText() {

    textIndex = game.math.wrapValue(textIndex, 1, text.length);

    font.text = text[textIndex];

}

function update() {

    var pv, ph;

    for (var i = 0; i < total; i++)
    {
        pv = posV[i];
        ph = posH[i];

        if (sine === 0)
        {
            images.getAt(i).x = dataH[ph].x;
        }
        else
        {
            images.getAt(i).x = dataH2[ph].x;
        }

        images.getAt(i).y = dataV[pv].y;

        posV[i] = game.math.wrapValue(pv, 1, dataV.length);
        posH[i] = game.math.wrapValue(ph, 1, dataH.length);

    }

}
