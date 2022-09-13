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
        this.load.image('block', 'assets/sprites/steelbox.png');
    }

    create ()
    {
        const b1 = this.add.image(100, 300, 'block');
        const b2 = this.add.image(500, 300, 'block').setTint(0xff0000);

        this.input.once('pointerdown', () => {

            this.tweens.add({
                targets: b1,
                x: 500-64,
                duration: 2000,
                ease: 'Linear',
            });

            this.tweens.add({
                targets: b1,
                x: 700-64,
                duration: 1000,
                ease: 'Linear',
                delay: 2000
            });

            this.tweens.add({
                targets: b2,
                x: 700,
                duration: 1000,
                ease: 'Linear',
                delay: 2000
            });

            // setTimeout(() => {
            //     blockCpuFor(1500)
            // }, 1000);

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
