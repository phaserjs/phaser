
var backgroundSceneConfig = {
    key: 'background',
    active: true,
    create: createBackground,
    render: renderBackground,
    pack: {
        files: [
            { type: 'image', key: 'face', url: 'assets/pics/bw-face.png' }
        ]
    }
};

var modalSceneConfig = {
    key: 'modal',
    active: true,
    renderToTexture: false,
    x: 64,
    y: 64,
    width: 320,
    height: 200,
    create: createModal,
    render: renderModal,
    pack: {
        files: [
            { type: 'image', key: 'logo', url: 'assets/pics/agent-t-buggin-acf-logo.png' }
        ]
    }
};

var gameConfig = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ backgroundSceneConfig, modalSceneConfig ]
};

var game = new Phaser.Game(gameConfig);

function createBackground ()
{
    this.add.image(400, 300, 'face');
}

function createModal ()
{
    this.cameras.main.setBackgroundColor('rgba(255,0,0,0.4)');

    console.log(this.cameras.main.backgroundColor);

    this.add.image(0, 0, 'logo').setOrigin(0);
}

var r = 0;

function renderBackground (ctx)
{
    ctx.fillStyle = 'rgb(' + r + ', 0, 0)';
    ctx.fillRect(0, 0, 32, 32);

    r += 2;

    if (r >= 256)
    {
        r = 0;
    }
}

function renderModal (ctx)
{
    ctx.fillStyle = 'rgb(0, ' + r + ', 0)';
    ctx.fillRect(0, 0, 32, 32);

    r += 2;

    if (r >= 256)
    {
        r = 0;
    }
}
