var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var gui = null;
var emitter = null;
var move = false;
var countText = null;
var angleConfig = {
    min: 0, max: 360
};
var speedConfig = {
    min: 0, max: 200
};
var scaleConfig = {
    start: 1, end: 0, ease: 'Linear'
};
var alphaConfig = {
    start: 1, end: 0, ease: 'Linear'
};
var eases = [
    'Linear',
    'Quad.easeIn',
    'Cubic.easeIn',
    'Quart.easeIn',
    'Quint.easeIn',
    'Sine.easeIn',
    'Expo.easeIn',
    'Circ.easeIn',
    'Back.easeIn',
    'Bounce.easeIn',
    'Quad.easeOut',
    'Cubic.easeOut',
    'Quart.easeOut',
    'Quint.easeOut',
    'Sine.easeOut',
    'Expo.easeOut',
    'Circ.easeOut',
    'Back.easeOut',
    'Bounce.easeOut',
    'Quad.easeInOut',
    'Cubic.easeInOut',
    'Quart.easeInOut',
    'Quint.easeInOut',
    'Sine.easeInOut',
    'Expo.easeInOut',
    'Circ.easeInOut',
    'Back.easeInOut',
    'Bounce.easeInOut'
].sort();
var blendModes = {
    NORMAL: Phaser.BlendModes.NORMAL,
    ADD: Phaser.BlendModes.ADD,
    MULTIPLY: Phaser.BlendModes.MULTIPLY,
    SCREEN: Phaser.BlendModes.SCREEN
};
var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('spark0', 'assets/particles/blue.png');
    this.load.image('spark1', 'assets/particles/red.png');
}

function create ()
{
    if (typeof dat === 'undefined')
    {
        this.add.text(16, 16, 'Please [Launch] this example.');
        return;
    }

    gui = new dat.GUI();
    emitter = this.add.particles('spark1').createEmitter({
        name: 'sparks',
        x: 400,
        y: 300,
        gravityY: 300,
        speed: speedConfig,
        angle: angleConfig,
        scale: scaleConfig,
        alpha: alphaConfig,
        blendMode: 'SCREEN'
    });

    gui.add(emitter, 'name');
    gui.add(emitter, 'on');
    gui.add(emitter, 'blendMode', blendModes).name('blend mode').onChange(function (val) { emitter.setBlendMode(Number(val)); });
    gui.add(angleConfig, 'min', 0, 360, 5).name('angle min').onChange(function() { emitter.setAngle(angleConfig); });
    gui.add(angleConfig, 'max', 0, 360, 5).name('angle max').onChange(function() { emitter.setAngle(angleConfig); });
    gui.add({ life: 1000 }, 'life', 100, 5000, 100).onChange(function(value) { emitter.setLifespan(value); });
    gui.add({ gravityX: 0 }, 'gravityX', -300, 300, 10).onChange(function(value) { emitter.setGravityX(value); });
    gui.add({ gravityY: 300 }, 'gravityY', -300, 300, 10).onChange(function(value) { emitter.setGravityY(value); });
    gui.add(speedConfig, 'min', 0, 600, 10).name('speed min').onChange(function() { emitter.setSpeed(speedConfig); });
    gui.add(speedConfig, 'max', 0, 600, 10).name('speed max').onChange(function() { emitter.setSpeed(speedConfig); });
    gui.add(scaleConfig, 'start', 0, 1, 0.1).name('scale start').onChange(function() { emitter.setScale(scaleConfig); });
    gui.add(scaleConfig, 'end', 0, 1, 0.1).name('scale end').onChange(function() { emitter.setScale(scaleConfig); });
    gui.add(scaleConfig, 'ease', eases).name('scale ease').onChange(function() { emitter.setScale(scaleConfig); });
    gui.add(alphaConfig, 'start', 0, 1, 0.1).name('alpha start').onChange(function() { emitter.setAlpha(alphaConfig); });
    gui.add(alphaConfig, 'end', 0, 1, 0.1).name('alpha end').onChange(function() { emitter.setAlpha(alphaConfig); });
    gui.add(alphaConfig, 'ease', eases).name('alpha ease').onChange(function() { emitter.setAlpha(alphaConfig); });
    gui.add(emitter, 'killAll');
    gui.add(emitter, 'pause');
    gui.add(emitter, 'resume');
    gui.add({save: saveEmitter.bind(this)}, 'save').name('save JSON');

    this.input.on('pointermove', function (pointer) {
        if (move)
        {
            emitter.setPosition(pointer.x, pointer.y);
        }
    });

    this.input.on('pointerdown', function (pointer) {
        emitter.setPosition(pointer.x, pointer.y);
        move = true;
    });
    this.input.on('pointerup', function (pointer) {
        move = false;
    });

    countText = this.add.text(0, 0, 'Alive Particles');
}

function update ()
{
    if (!countText) { return; }

    countText.setText('Alive Particles: ' + emitter.getAliveParticleCount());
}

function saveEmitter ()
{
    this.load.saveJSON(emitter.toJSON(), emitter.name + '.json');
}
