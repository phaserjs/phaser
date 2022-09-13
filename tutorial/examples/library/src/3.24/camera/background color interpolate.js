var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    width: 800,
    height: 600
};

var game = new Phaser.Game(config);

var player;

var sky;
var space;

var w;
var h;

function preload()
{
    this.load.image('star', 'assets/demoscene/star2.png');
    this.load.image('dude', 'assets/sprites/phaser-dude.png');
}

function create()
{
    w = this.cameras.main.width;
    h = this.cameras.main.height;
    
    bg = this.add.group({ key: 'star', frameQuantity: 300 });

    sky = new Phaser.Display.Color(120, 120, 255);
    space = new Phaser.Display.Color(0, 0, 0);

    player = this.add.sprite(w / 2, 0, 'dude');

    this.cameras.main.startFollow(player);

    var rect = new Phaser.Geom.Rectangle(0, -2 * h, w, 2 * h);

    Phaser.Actions.RandomRectangle(bg.getChildren(), rect);
}

function update()
{
    player.y = (Math.cos(this.time.now / 1000) * (h - 10)) - h;

    var hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(sky, space, -h * 2, player.y);

    this.cameras.main.setBackgroundColor(hexColor);
}
