var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.glsl('bundle', 'assets/shaders/bundle2.glsl.js');
    this.load.image('logo', 'assets/sprites/phaser3-logo-small.png');
}

function create ()
{
    var shader = this.add.shader('Marble', 0, 0, 256, 256);

    shader.setRenderToTexture('wibble');

    //  Just so we can see the shader
    this.add.image(0, 0, 'wibble').setOrigin(0);

    var rt = this.add.renderTexture(256, 0, 256, 256);

    //  Notice how it doesn't draw the shader texture if you call JUST this
    rt.drawFrame('wibble', '__BASE', 100, 100);
    rt.draw('logo', 0, 0);

    this.input.on('pointerdown', function () {

        //  But, draw it in the event handler and it works fine
        rt.drawFrame('wibble', '__BASE');
        rt.draw('logo', Math.random() * 200, Math.random() * 200);

    });
}
