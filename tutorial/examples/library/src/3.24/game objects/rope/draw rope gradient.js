class Example extends Phaser.Scene
{
    constructor ()
    {
        super();

        this.ropes = [];
        this.count = 0;
    }

    preload ()
    {
        this.load.image('bg', 'assets/rope/background-chalk.jpg');
        this.load.image('block', 'assets/rope/6x6.png');
    }

    create ()
    {
        this.add.image(400, 300, 'bg');

        const debug = this.add.graphics().fillStyle(0xffffff);

        const distance = 6;
        const prev = new Phaser.Math.Vector2();

        const hsl = Phaser.Display.Color.HSVColorWheel();

        let colorIndex = 0;
        let points = [];
        let colors = [];

        this.input.on('pointerdown', (pointer) => {

            points = [];
            colors = [];
            colorIndex = 0;

            prev.x = pointer.x;
            prev.y = pointer.y;
    
            points.push(new Phaser.Math.Vector2(pointer.x, pointer.y));
            colors.push(hsl[0].color);

            debug.fillStyle(hsl[0].color);
            debug.fillRect(pointer.x - 1, pointer.y - 1, 3, 3);
    
        });
  
        this.input.on('pointermove', (pointer) => {

            if (pointer.isDown)
            {
                const x = pointer.x;
                const y = pointer.y;
    
                if (Phaser.Math.Distance.Between(x, y, prev.x, prev.y) > distance)
                {
                    prev.x = x;
                    prev.y = y;
    
                    points.push(new Phaser.Math.Vector2(pointer.x, pointer.y));
                    colors.push(hsl[colorIndex].color);
    
                    debug.fillStyle(hsl[colorIndex].color);
                    debug.fillRect(pointer.x, pointer.y, 2, 2);

                    colorIndex = Phaser.Math.Wrap(colorIndex + 2, 0, 359);
                }
            }
    
        });
    
        this.input.on('pointerup', () => {

            debug.clear();

            const rope = this.add.rope(0, 0, 'block', null, points, true, colors);

            this.ropes.push(rope);

        });

        this.add.text(10, 10, 'Draw with the mouse', { font: '16px Courier', fill: '#ffffff' }).setShadow(1, 1).setDepth(1);
    }

    update ()
    {
        this.count += 0.5;

        this.ropes.forEach((rope) => {

            let points = rope.points;

            for (let i = 0; i < points.length; i++)
            {
                points[i].x += Math.cos(i * 0.5 + this.count);
            }
    
            rope.setDirty();

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

let game = new Phaser.Game(config);
