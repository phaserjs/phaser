var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    parent: 'phaser-example',
    physics: { default: 'arcade' },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

var block;

function preload ()
{
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
    this.load.image('block', 'assets/sprites/chunk.png');
}

function create ()
{
    let containerWidth = 200;
    let containerHeight = 200;
    let background = this.add.rectangle(0, 0, containerWidth, containerHeight, 0xff0000, 0.2);
    background.setOrigin(0, 0);
    let bottomRight = this.add.circle(containerWidth, containerHeight, 9, 0xff0000);
    bottomRight.setOrigin(0.5, 0.5);
    let text = this.add.text(bottomRight.x, bottomRight.y - 20, `${bottomRight.x}, ${bottomRight.y}`);
    text.setOrigin(0.5, 1);
    let scaleLabel = this.add.text(0, 0, "Scale: 1");
    scaleLabel.setOrigin(0, 0);
    let particles = this.add.particles("block");
    particles.setPosition(bottomRight.x, bottomRight.y);
    particles.createEmitter({
        frequency: 33,
        quantity: 1,
        alpha: { start: 1, end: 0, ease: "Cubic.easeOut" },
        lifespan: 1000,
        speed: 100,
    });
    let container = this.add.container(0, 0, [background, bottomRight, text, particles]);
    this.tweens.add({
        targets: container,
        duration: 1200,
        ease: Phaser.Math.Easing.Sine.InOut,
        scale: 3,
        yoyo: true,
        hold: 600,
        repeat: -1,
        repeatDelay: 600,
        onUpdate: () => {
            scaleLabel.text = `Container scale: ${container.scale.toFixed(2)}`;
        },
    });
}
