class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    create ()
    {
        this.graphics = this.add.graphics();

        this.shapes = new Array(15).fill(null).map(
            () => new Phaser.Geom.Circle(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), Phaser.Math.Between(25, 75))
        );

        this.rect = Phaser.Geom.Rectangle.Clone(this.cameras.main);
    }

    update ()
    {
        this.shapes.forEach(function (shape, i) {
            shape.x += (1 + 0.1 * i);
            shape.y += (1 + 0.1 * i);
        });

        Phaser.Actions.WrapInRectangle(this.shapes, this.rect, 72);

        this.draw();
    }

    // Locals methods, they are not part of Phaser.scene
    color (i)
    {
        return 0x001100 * (i % 15) + 0x000033 * (i % 5);
    }

    draw ()
    {
        this.graphics.clear();

        this.shapes.forEach((shape, i) => {
            this.graphics
            .fillStyle(this.color(i), 0.5)
            .fillCircleShape(shape);
        }, this);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
