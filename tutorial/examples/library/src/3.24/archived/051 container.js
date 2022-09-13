var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {

    this.load.image('bg', 'assets/skies/sky1.png');
    this.load.image('particle', 'assets/sprites/aqua_ball.png');
    this.load.image('logo', 'assets/sprites/phaser2.png');

}

var container;
var image;
var logo;
var sprites = [];

function create() {

    container = this.add.container(this, 400, 300);
    container.pivotX = 400;
    container.pivotY = 300;

    image = this.add.image(0, 0, 'bg', 0, container);
    image.alpha = 0.5;

    //  Create the sprites
    for (var i = 0; i < 500; i++)
    {
        var x = Phaser.Math.Between(-64, 800);
        var y = Phaser.Math.Between(-64, 600);

        image = this.add.image(x, y, 'particle', 0, container);

        // image.blendMode = Phaser.blendModes.ADD;
        // image.blendMode = Phaser.blendModes.MULTIPLY;

        sprites.push({ s: image, r: 2 + Math.random() * 6 });
    }

    container.alpha = 0.5;

    // logo = this.add.image(400, 300, 'logo', 0, container);
    logo = this.add.image(400, 300, 'logo');
    logo.anchor = 0.5;
    logo.scale = 0.5;

    // game.add.tween(logo).to( { scaleX: 2, scaleY: 2 }, 3000, "Sine.easeInOut", true, 0, -1, true);

}

function update() {

    container.rotation += 0.01;

    for (var i = 0; i < sprites.length; i++)
    {
        var sprite = sprites[i].s;

        sprite.y -= sprites[i].r;

        if (sprite.y < -256)
        {
            sprite.y = 700;
        }
    }

}
