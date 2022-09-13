var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var rect = new Phaser.Geom.Rectangle(0, 0, 800, 600);

    var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x0000aa } });

    var count = 0;
    var lines = [];

    while(rect.height > 5)
    {
        switch(count++ % 4)
        {
            case 0:
                lines.push(rect.getLineA());
                break;
            case 1:
                lines.push(rect.getLineB());
                break;
            case 2:
                lines.push(rect.getLineC());
                break;
            case 3:
                lines.push(rect.getLineD());
                break;
        }

        rect.width *= 0.95;
        rect.height *= 0.95;

        rect.centerX = 400;
        rect.centerY = 300;
    }

    for(var i = 0; i < lines.length - 1; i++)
    {
        var firstLine = lines[i];

        var secondLine = lines[i + 1];

        graphics.lineBetween(firstLine.x1, firstLine.y1, secondLine.x1, secondLine.y1);
        graphics.lineBetween(firstLine.x2, firstLine.y2, secondLine.x2, secondLine.y2);
    }
}
