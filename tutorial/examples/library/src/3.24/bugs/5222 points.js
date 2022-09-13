class MainScene extends Phaser.Scene {
    constructor() {
      super({ key: 'main' });
    }

    create() {

      const g = this.add.graphics();

      const line = new Phaser.Geom.Line(100, 100, 300, 100);

      g.lineStyle(1, 0xff0000);
      g.strokeLineShape(line);

    //   const points = Phaser.Geom.Line.GetPoints(line, 5);
      const points = Phaser.Geom.Line.GetPoints(line, 0, 64);

      points.forEach(point => {

        this.add.circle(point.x, point.y, 4, 0x00ff00);

      });

      //   this.add.line(0, 0, 100, 100, 300, 100, 0xff0000).setOrigin(0);

    //   this.add.rectangle(100, 100, 5, 5, 0x0000ff);
    //   this.add.rectangle(300, 100, 5, 5, 0x0000ff);

    //   Phaser.Actions.PlaceOnLine(balls, line);

    }

    update() {
    }
  }

  const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    backgroundColor: '#000000',
    parent: 'game',
    scene: [MainScene]
  }
  const game = new Phaser.Game(config);
