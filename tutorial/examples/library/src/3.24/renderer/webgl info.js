var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var style = { font: '16px Courier', fill: '#00ff00' };

    this.add.text(10, 10, 'WebGL Config', { font: '32px Courier', fill: '#00ff00' });

    this.add.text(10, 60, [ 'Supported Extensions', '--------------------', '' ].concat(this.renderer.supportedExtensions), style);

    var config = [];

    for (var key in this.renderer.config)
    {
        config.push(key + ': ' + this.renderer.config[key]);
    }

    this.add.text(500, 60, [ 'Renderer Config', '---------------', '' ].concat(config), style);

    var compression = [];

    for (var key in this.renderer.compression)
    {
        compression.push(key + ': ' + this.renderer.compression[key]);
    }

    this.add.text(500, 300, [ 'Texture Compression', '-------------------', '' ].concat(compression), style);

    this.add.text(500, 450, [ 'WebGL Textures', '--------------', '', 'Max Textures: ' + this.renderer.maxTextures, 'Max Texture Size: ' + this.renderer.getMaxTextureSize() ], style);
}
