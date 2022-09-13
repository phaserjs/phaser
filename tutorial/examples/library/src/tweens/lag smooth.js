let shouldRun = true;

function blockCpuFor(ms) {
	var now = new Date().getTime();
    console.log('start blocking');
    var result = 0;
	while(shouldRun) {
		result += Math.random() * Math.random();
		if (new Date().getTime() > now +ms)
        {
            console.log('end blocking');
			return;
        }
	}
}

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('chunk', 'assets/sprites/chunk.png');
    }

    create ()
    {
        const targets = [];

        let x = 0;
        let y = 0;

        for (let i = 0; i < 2560; i++)
        {
            targets.unshift(this.add.image(x, y, 'chunk').setOrigin(0, 0));

            x += 5;

            if (x >= 800)
            {
                x = 0;
                y += 5;
            }
        }

        this.input.once('pointerdown', () => {

            this.tweens.add({
                targets,
                y: '+=500',
                duration: 2000,
                ease: 'Linear',
                delay: this.tweens.stagger(1)
            });

            setTimeout(() => {
                blockCpuFor(1500)
            }, 1000);

        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: Example,
    fps: {
        // smoothStep: false
        // limit: 30
    }
};

const game = new Phaser.Game(config);
