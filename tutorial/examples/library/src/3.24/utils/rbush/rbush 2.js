var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var result;
var boxX = 0;
var boxY = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('phaser', 'assets/sprites/diamond.png');
}

function create ()
{
    var tree = Phaser.Structs.RTree();

    var w = this.sys.textures.getFrame('phaser').width;
    var h = this.sys.textures.getFrame('phaser').height;

    for (var i = 0; i < 512; i++)
    {
        var x = Phaser.Math.Between(0, 800);
        var y = Phaser.Math.Between(0, 600);

        var sprite = this.add.image(x, y, 'phaser').setOrigin(0);

        tree.insert({
            left: x,
            top: y,
            right: x + w,
            bottom: y + h,
            sprite: sprite,
            w: w,
            h: h
        });
    }

    result = tree.search({
        minX: 0,
        minY: 0,
        maxX: 256,
        maxY: 256
    });

    this.input.on('pointermove', function (pointer) {

        boxX = pointer.x;
        boxY = pointer.y;

        result = tree.search({
            minX: boxX,
            minY: boxY,
            maxX: boxX + 256,
            maxY: boxY + 256
        });

    });

    this.events.on('render', render, this);
}

function render ()
{
    var ctx = this.sys.game.context;

    ctx.strokeStyle = 'rgba(255,255,255,1)';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, 256, 256);

    ctx.fillStyle = 'rgba(255,0,0,0.5)';

    result.forEach(function(s) {

        ctx.fillRect(s.left, s.top, s.w, s.h);

    });
}
