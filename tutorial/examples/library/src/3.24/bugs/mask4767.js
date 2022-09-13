var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 640,
    height: 480,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('backdrop', 'assets/pics/platformer-backdrop.png');
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
}

function create() {
    // BACKGROUND IMAGE
    var background = this.make.image({
        x: game.config.width / 2,
        y: game.config.height / 2,
        key: 'backdrop',
        add: true,
        depth: 0
    }).setScale(2);


    // MIDDLE IMAGE TO APPLY MASK TO
    var middleImage = this.make.image({
        x: game.config.width / 2,
        y: game.config.height / 2,
        key: 'backdrop',
        add: true,
        depth: 100
    }).setScale(2);
    middleImage.setTintFill(0x000000); // Make it darkness


    // PARTICLE MANAGER USED AS MASK FOR MIDDLE IMAGE
    var maskParticle = this.add.particles('flares');
    maskParticle.setDepth(100);
    maskParticle.setVisible(false);

    maskParticle.createEmitter({
        frame: 'green',
        x: 300,
        y: 400,
        lifespan: 2000,
        speedY: { min: -100, max: -400 },
        speedX: { min: -50, max: 50 },
        angle: -90,
        gravityY: 300,
        scale: { start: 1, end: 1 },
        quantity: 5
    });

    let mask = new Phaser.Display.Masks.BitmapMask(this, maskParticle);
    mask.invertAlpha = true;
    middleImage.setMask(mask);


    // PARTICLE MANAGER BELOW IMAGE WITH MASK
    var belowParticle = this.add.particles('flares');
    belowParticle.setDepth(1);

    belowParticle.createEmitter({
        frame: 'yellow',
        x: 175,
        y: 400,
        lifespan: 2000,
        speedY: { min: -100, max: -400 },
        speedX: { min: -50, max: 50 },
        angle: -90,
        gravityY: 300,
        scale: { start: 0.4, end: 0 },
        quantity: 5,
        blendMode: 'ADD'
    });


    // PARTICLE MANAGER ABOVE IMAGE WITH MASK
    var aboveParticle = this.add.particles('flares');
    aboveParticle.setDepth(200);

    aboveParticle.createEmitter({
        frame: 'red',
        x: 425,
        y: 400,
        lifespan: 2000,
        speedY: { min: -100, max: -400 },
        speedX: { min: -50, max: 50 },
        angle: -90,
        gravityY: 300,
        scale: { start: 0.4, end: 0 },
        quantity: 5,
        blendMode: 'ADD'
    });
}