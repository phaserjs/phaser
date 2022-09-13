var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var graphics;
var rect;
var direction = 1;

function create ()
{
    graphics = this.add.graphics({ lineStyle: { color: 0x0000ff }, fillStyle: { color: 0x0000ff }});

    rect = new Phaser.Geom.Rectangle(400, 300, 0, 0);
}

function update ()
{
    graphics.clear();

    rect.width += 2.4 * direction;
    rect.height += 1.8 * direction;

    if(rect.width * direction >= 200)
    {
        direction *= -1;
    }

    if(!rect.isEmpty())
    {
        graphics.fillRectShape(rect);
    }
    else
    {
        graphics.strokeRectShape(rect);
    }
}
