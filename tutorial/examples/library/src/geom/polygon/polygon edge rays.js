class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    create ()
    {
        const border = new Phaser.Geom.Polygon([ 0, 0, 800, 0, 800, 600, 0, 600, 0, 0 ]);

        const shape1 = new Phaser.Geom.Polygon([ 100, 150, 120, 50, 200, 80, 140, 210, 100, 150 ]);
        const shape2 = new Phaser.Geom.Polygon([ 100, 200, 120, 250, 60, 300, 100, 200 ]);
        const shape3 = new Phaser.Geom.Polygon([ 200, 260, 220, 150, 300, 200, 350, 320, 200, 260 ]);
        const shape4 = new Phaser.Geom.Polygon([ 340, 60, 360, 40, 370, 70, 340, 60 ]);
        const shape5 = new Phaser.Geom.Polygon([ 450, 190, 560, 170, 540, 270, 430, 290, 450, 190 ]);
        const shape6 = new Phaser.Geom.Polygon([ 400, 95, 580, 50, 480, 150, 400, 95 ]);
        const shape7 = new Phaser.Geom.Polygon([ 100, 150, 120, 50, 200, 80, 140, 210, 100, 150 ]);
        const shape8 = new Phaser.Geom.Polygon([ 100, 200, 120, 250, 60, 300, 100, 200 ]);
        const shape9 = new Phaser.Geom.Polygon([ 200, 260, 220, 150, 300, 200, 350, 320, 200, 260 ]);
        const shape10 = new Phaser.Geom.Polygon([ 340, 60, 360, 40, 370, 70, 340, 60 ]);
        const shape11 = new Phaser.Geom.Polygon([ 450, 190, 560, 170, 540, 270, 430, 290, 450, 190 ]);
        const shape12 = new Phaser.Geom.Polygon([ 400, 95, 580, 50, 480, 150, 400, 95 ]);

        Phaser.Geom.Polygon.Translate(shape2, 0, 150);
        Phaser.Geom.Polygon.Translate(shape5, 50, 0);
        Phaser.Geom.Polygon.Translate(shape7, 550, 200);
        Phaser.Geom.Polygon.Translate(shape8, 300, 200);
        Phaser.Geom.Polygon.Translate(shape9, 280, 170);
        Phaser.Geom.Polygon.Translate(shape10, 140, 480);
        Phaser.Geom.Polygon.Translate(shape11, -300, 270);
        Phaser.Geom.Polygon.Translate(shape12, 200, -30);

        const shapes = [ border, shape1, shape2, shape3, shape4, shape5, shape6, shape7, shape8, shape9, shape10, shape11, shape12 ];

        const ray = new Phaser.Geom.Line(400, 300, 400, 300);

        const debug = this.add.graphics();

        const draw = (pointer) => {

            const intersects = Phaser.Geom.Intersects.GetRaysFromPointToPolygon(pointer.worldX, pointer.worldY, shapes);

            debug.clear();

            //  Draw the intersections

            debug.lineStyle(1, 0xff0000);
            debug.fillStyle(0xff0000);

            intersects.forEach(line => {

                ray.setTo(pointer.worldX, pointer.worldY, line.x, line.y);

                debug.strokeLineShape(ray);
                debug.fillCircle(line.x, line.y, 4);

            });

            //  Draw all shapes

            debug.lineStyle(1, 0x00ff00);

            shapes.forEach(shape => {

                debug.strokePoints(shape.points);

            });

        };

        draw({ worldX: 450, worldY: 200 });

        this.input.on('pointermove', pointer => draw(pointer));

    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: Example
};

let game = new Phaser.Game(config);
