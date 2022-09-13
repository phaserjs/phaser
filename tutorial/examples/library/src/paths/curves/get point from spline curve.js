class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    create ()
    {
        const graphics = this.add.graphics().lineStyle(1, 0xffffff, 1);

        const points = [
            50, 300,
            164, 246,
            274, 302,
            412, 400,
            522, 241,
            664, 364,
            750, 400
        ];

        const startX = points[0];
        const endX = points[points.length - 2];

        const curve = new Phaser.Curves.Spline(points);

        curve.draw(graphics, 64);

        const point = curve.getPointAt(0);

        const location = this.add.rectangle(point.x, point.y, 16, 16, 0xff00ff, 0.8);

        this.input.on('pointermove', pointer => {

            //  getPointAt requires a value between 0 and 1 (start and end of curve)
            //  We know the start and end x coordinate of the curve, so we can calculate it from that

            let px = pointer.worldX;
            const distance = endX - startX;

            if (px >= startX && px <= endX)
            {
                px -= startX;

                curve.getPointAt(px / distance, point);

                location.setPosition(point.x, point.y);
            }

        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: Example
};

const game = new Phaser.Game(config);
