var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('fantasy', 'assets/tilemaps/tiles/fantasy-tiles.png');
}

function create ()
{
    const tiles = this.textures.get('fantasy');
    const base = tiles.get();

    Phaser.Textures.Parsers.SpriteSheet(tiles, base.sourceIndex, base.x, base.y, base.width, base.height, {
        frameWidth: 64,
        frameHeight: 64
    });

    this.add.sprite(200, 300, 'fantasy', 6);
    this.add.sprite(300, 300, 'fantasy', 24);
    this.add.sprite(400, 300, 'fantasy', 28);
    this.add.sprite(500, 300, 'fantasy', 31);
    this.add.sprite(600, 300, 'fantasy', 49);
}
