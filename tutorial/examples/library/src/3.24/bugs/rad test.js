var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var cursors;
var a = 0;
var container;
var image;
var text;
var text2;
var px = 400;
var py = 300;
var hit = false;
var gfx;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.script('glmatrix', 'http://192.168.0.100/gl-matrix/dist/gl-matrix.js');
    this.load.script('pixi', 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.7.1/pixi.min.js');
    this.load.image('land', 'assets/sprites/advanced_wars_land.png');
}

function create ()
{
    // var image = this.add.tileSprite(0, 0, 512, 256, 'mushroom');

    gfx = this.add.graphics();

    container = this.add.container(400, 300);

    //  child
    image = this.add.image(0, 0, 'land');
    container.add(image);

    //  stand-alone
    // image = this.add.image(400, 300, 'land');

    image.setInteractive();

    cursors = this.input.keyboard.createCursorKeys();

    var graphics = this.add.graphics();

    graphics.fillStyle(0xff0000);
    graphics.fillRect(px - 3, py - 3, 6, 6);

    this.input.on('pointerup', function (pointer) {

        px = pointer.x;
        py = pointer.y;

        graphics.clear();
        graphics.fillStyle(0xff0000);
        graphics.fillRect(px - 3, py - 3, 6, 6);

    });

    text = this.add.text(10, 10, 'Hit?', { font: '16px Courier', fill: '#00ff00' });

    text2 = this.add.text(400, 10, '', { font: '16px Courier', fill: '#00ff00' });

    //  glMatrix
    // var gm = mat2d.create();
    // console.log(gm);

    // var pm = new PIXI.Matrix();
    // console.log(pm);

    var app = new PIXI.Application();
    
    document.getElementById('phaser-example').appendChild(app.view);

    // var ps = new PIXI.Sprite();
    // console.log(ps.rotation);

    PIXI.loader.add('land', 'assets/sprites/advanced_wars_land.png').load((loader, resources) => {

        const pc = new PIXI.Container();

        var sprite = new PIXI.Sprite(resources.land.texture);

        sprite.x = app.renderer.width / 2;
        sprite.y = app.renderer.height / 2;

        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        pc.addChild(sprite);

        app.stage.addChild(pc);

        app.ticker.add(() => {

            sprite.rotation = image._rotation;

            text2.setText([ 'Rot: ' + sprite.rotation ]);

        });
    });
}


function update ()
{
    if (cursors.left.isDown)
    {
        image.angle--;
    }
    else if (cursors.right.isDown)
    {
        image.angle++;
    }

    var c = this.game.input.hitTest({ x: px, y: py }, [ image ], this.cameras.main);

    hit = (c.length === 1);

    text.setText([ 'Hit: ' + hit, 'Angle: ' + image.angle.toString(), 'Rot: ' + image._rotation, 'x/y: ' + px.toString() + ' x ' + py.toString() ]);

    gfx.clear();

    if (hit)
    {
        gfx.fillStyle(0x00ff00);
        gfx.fillRect(0, 500, 800, 600);
    }
    else
    {
        gfx.fillStyle(0xff0000);
        gfx.fillRect(0, 500, 800, 600);
    }
}
