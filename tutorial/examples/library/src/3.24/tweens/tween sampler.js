const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);

let tween;
const easeTypes = [
    'Back',
    'Bounce',
    'Circular',
    'Cubic',
    'Elastic',
    'Expo',
    'Expo.easeInOut',
    'Linear',
    'Quadratic',
    'Quartic',
    'Quintic',
    'Sine',
    'Sine.easeInOut',
    'Sine.easeOut',
    'Stepped'
];
const easeTypeParams = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [5],
];

function preload()
{
    this.load.image('block', 'assets/sprites/block.png');
}

function resetTween(image)
{
    if (tween) { tween.pause(); }
    image.x = 300;
    image.y = 70;
}
function create()
{
    let strMessage = 'Type a letter: \n';
    for (let i = 0; i < easeTypes.length; i++)
    {
        const ltr = (i + 10).toString(36)
        strMessage += ltr + ": " + easeTypes[i] + '\n';
    }

    strMessage += '\n\n(Most types can add:\n.easeIn, \n.easeInOut, \n.easeOut)'
    this.add.text(20, 20, strMessage);

    const marker = this.add.image(300, 70, 'block').setAlpha(0.3);
    const image = this.add.image(300, 70, 'block');

    this.input.keyboard.on('keydown', function (event) {
        const idx = event.keyCode - 65;
        resetTween(image);
        tween = this.tweens.add({
            targets: image,
            x: 730,
            y: 530,
            duration: 3000,
            ease: easeTypes[idx],
            easeParams: easeTypeParams[idx],
            yoyo: true,
        });
    }, this);
}
