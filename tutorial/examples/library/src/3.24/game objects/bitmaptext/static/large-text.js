var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    width: 1024,
    height: 768
};

var game = new Phaser.Game(config);
var largeText = null;
var bunny = null;
var vx = 4;
var vy = 4;

function preload() 
{
    this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
    this.load.text('loremipsum', 'assets/text/loremipsum.txt');
    this.load.image('bunny', 'assets/sprites/bunny.png');
}

function create() 
{
    largeText = this.add.bitmapText(0, 0, 'desyrel', game.cache.text.get('loremipsum'));
    bunny = this.add.sprite(0, 0, 'bunny');
    bunny.originX = 0;
    bunny.originY = 0;
}

function update()
{
    largeText.y -= 0.3;
    bunny.x += vx;
    bunny.y += vy;

    if (bunny.x + bunny.width > 1024)
    {
        vx *= -1;
        bunny.x = 1024 - bunny.width;
    }
    else if (bunny.x < 0)
    {
        bunny.x = 0;
        vx *= -1;
    }
    if (bunny.y + bunny.height > 768)
    {
        vy *= -1;
        bunny.y = 768 - bunny.height;
    }
    else if (bunny.y < 0)
    {
        bunny.y = 0;
        vy *= -1;
    }
}