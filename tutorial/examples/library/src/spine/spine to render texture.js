var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    scene: {
        preload: preload,
        create: create,
        pack: {
            files: [
                { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePluginDebug.js', sceneKey: 'spine' }
            ]
        }
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/sprites/phaser.png');

    this.load.setPath('assets/spine/3.8/demos/');

    this.load.spine('set1', 'demos.json', [ 'atlas1.atlas' ], true);
}

function create ()
{
    this.add.image(0, 0, 'logo').setOrigin(0);

    var rt = this.add.renderTexture(0, 0, 800, 600);

    var boy = this.add.spine(400, 300, 'set1.spineboy', 'idle', true).setScale(0.25);

    this.add.text(200, 8, 'Click to stamp SpineBoy');

    this.input.on('pointermove', function (pointer) {

        boy.setPosition(pointer.x, pointer.y);

    }, this);

    this.input.on('pointerdown', function (pointer) {

        rt.draw(boy);

        boy.angle += 10;

    }, this);
}
