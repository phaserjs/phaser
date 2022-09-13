var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('turkey', 'assets/pics/turkey-1985086.jpg');
}

function create ()
{
    //  WebGL only:

    var gl = this.sys.game.renderer.gl;

    var renderer = this.sys.game.renderer;

    var modeIndex = renderer.addBlendMode([ gl.ZERO, gl.SRC_COLOR ], gl.FUNC_ADD);

    var graphics = this.add.graphics();

    var color = 0xffffff;
    var alpha = 1;

    graphics.fillStyle(color, alpha);

    graphics.fillCircle(400, 300, 256);

    this.add.image(400, 300, 'turkey').setBlendMode(modeIndex);
}
