class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.t = 0.0;
    }

    drawStar (graphics, cx, cy, spikes, outerRadius, innerRadius, color, lineColor)
    {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        graphics.save();
        graphics.lineStyle(4, lineColor, 1);
        graphics.fillStyle(color, 1);
        graphics.beginPath();
        graphics.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++)
        {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            graphics.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            graphics.lineTo(x, y);
            rot += step;
        }

        graphics.lineTo(cx, cy - outerRadius);
        graphics.closePath();
        graphics.fillPath();
        graphics.strokePath();
        graphics.restore();
    }

    preload() {
        this.load.image('swirl', 'assets/pics/color-wheel-swirl.png');
        this.load.image('checker', 'assets/pics/checker.png');
    }

    create() {

        const shape = this.make.graphics();

        checker = this.make.image({
            x: game.config.width / 2,
            y: game.config.height / 2,
            key: 'checker',
            add: true
        });


        const swirl = this.make.sprite({
            x: game.config.width / 2,
            y: game.config.height / 2,
            key: 'swirl',
            add: true
        });

        shape.x = game.config.width / 2;
        shape.y = game.config.height / 2;

        this.drawStar(shape, 0, 0, 5, 100, 100 / 2, 0xffff00, 0xff0000);

        swirl.mask = new Phaser.Display.Masks.GeometryMask(this, shape);

        this.input.on('pointermove', function (pointer) {

            shape.x = pointer.x;
            shape.y = pointer.y;

        });

    }

    update()
    {
        checker.x += Math.sin(this.t) * 1;
        this.t += 0.01;
    }
}
const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 640,
    height: 480,
    scene: [ Example ]
};

let checker;
const game = new Phaser.Game(config);

