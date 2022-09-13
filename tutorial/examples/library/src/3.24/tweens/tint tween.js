var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

// This example demonstrates the creation of random tint tweens on each segment.
// of an image.
new Phaser.Game(config);
var tween;
var image;
var fromColors;
var toColors;

function preload ()
{
    this.load.image('face', 'assets/pics/bw-face.png');
}

function getRandomVertexColors ()
{
    // Create a random color for each vertex.
    // RandomRGB returns a Phaser.Display.Color object with random RGB values.
    var RandomRGB = Phaser.Display.Color.RandomRGB;
    return {
        topLeft: RandomRGB(),
        topRight: RandomRGB(),
        bottomLeft: RandomRGB(),
        bottomRight: RandomRGB()
    };
}

function getTintColor (vertex)
{

    // Interpolate between the fromColor and toColor of the current vertex,
    // using the current tween value.
    var tint = Phaser.Display.Color.Interpolate.ColorWithColor(
        fromColors[vertex],
        toColors[vertex],
        100,
        tween.getValue()
    );

    // Interpolate.ColorWithColor returns a Javascript object with
    // interpolated RGB values. We convert it to a Phaser.Display.Color object
    // in order to get the integer value of the tint color.
    return Phaser.Display.Color.ObjectToColor(tint).color;
}

function tintTween (fromColors, toColors, callback)
{
    tween = this.tweens.addCounter({
        from: 0,
        to: 100,
        duration: 2000,
        onUpdate: function ()
        {
            image.setTint(
                getTintColor('topLeft'),
                getTintColor('topRight'),
                getTintColor('bottomLeft'),
                getTintColor('topRight')
            );
        },
        onComplete: callback
    });
}

function initTweens ()
{
    fromColors = toColors || fromColors;
    toColors = getRandomVertexColors();
    tintTween(
        fromColors,
        toColors,
        initTweens
    );
}

function create ()
{
    image = this.add.image(400, 300, 'face');

    fromColors = getRandomVertexColors();

    image.setTint(
        fromColors.topLeft.color,
        fromColors.topRight.color,
        fromColors.bottomLeft.color,
        fromColors.bottomRight.color
    );

    // Bind the scope to tintTween so we can use this.tweens inside it.
    tintTween = tintTween.bind(this);

    initTweens();
}
