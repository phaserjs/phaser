function create()
{
    const line1 = new Phaser.Geom.Line(100, 100, 200, 200);
    const line2 = new Phaser.Geom.Line(300, 100, 300, 300);

    const result = Phaser.Geom.Intersects.GetLineToLine(line1, line2);

    console.log(result);
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        create: create
    }
  };

const game = new Phaser.Game(config);
