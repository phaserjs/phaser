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
        this.load.image('pipe1', 'assets/rope/pipe1.png');
        this.load.image('pipe2', 'assets/rope/pipe2.png');
        this.load.image('pipe3', 'assets/rope/pipe3.png');
        this.load.image('pipe4', 'assets/rope/phaser3-logo.png');
    }

    create ()
    {
        const debug = this.add.graphics().fillStyle(0xffffff);

        const distance = 10;
        const prev = new Phaser.Math.Vector2();

        let pipe = 1;
        let points = [];

        this.input.on('pointerdown', (pointer) => {

            points = [];

            prev.x = pointer.x;
            prev.y = pointer.y;
    
            points.push(new Phaser.Math.Vector2(pointer.x, pointer.y));

            debug.fillRect(pointer.x, pointer.y, 2, 2);
    
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
    
                    debug.fillRect(pointer.x, pointer.y, 2, 2);
                }
            }
    
        });
    
        this.input.on('pointerup', (pointer) => {

            debug.clear();

            const rope = this.add.rope(0, 0, 'pipe' + pipe, null, points);

            this.ropes.push(rope);

            pipe++;

            if (pipe === 5)
            {
                pipe = 1;
            }

        });

        this.add.text(10, 10, 'Draw with the mouse', { font: '16px Courier', fill: '#ffffff' }).setShadow(1, 1).setDepth(1);
    }

    update ()
    {
        this.count += 0.1;

        this.ropes.forEach((rope) => {

            let points = rope.points;

            for (let i = 0; i < points.length; i++)
            {
                if (rope.horizontal)
                {
                    points[i].y += Math.sin(i * 0.15 + this.count) * 2;
                }
                else
                {
                    points[i].x += Math.sin(i * 0.25 + this.count) * 2;
                }
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
