
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('phaser', 'assets/sprites/phaser-dude.png');
    game.load.spritesheet('controller-indicator', 'assets/misc/controller-indicator.png', 16,16);
}

var sprite;

var pad1;

var indicator;

function create() {

    game.stage.backgroundColor = '#736357';

    sprite = game.add.sprite(300, 300, 'phaser');
    sprite.anchor.setTo(0.5,0.5);

    indicator = game.add.sprite(10,10, 'controller-indicator');
    indicator.scale.x = indicator.scale.y = 2;
    indicator.animations.frame = 1;

    game.input.gamepad.start();

    // To listen to buttons from a specific pad listen directly on that pad game.input.gamepad.padX, where X = pad 1-4
    pad1 = game.input.gamepad.pad1;
}

function update() {

    // Pad "connected or not" indicator
    if(game.input.gamepad.supported && game.input.gamepad.active && pad1.connected) {
        indicator.animations.frame = 0;
    } else {
        indicator.animations.frame = 1;
    }

    // Controls
    if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1)
    {
        sprite.x--;
    }
    if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)
    {
        sprite.x++;
    }
    if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1)
    {
        sprite.y--;
    }
    if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1)
    {
        sprite.y++;
    }
    if (pad1.justPressed(Phaser.Gamepad.XBOX360_A))
    {
        sprite.angle += 5;
    }
    if (pad1.justReleased(Phaser.Gamepad.XBOX360_B))
    {
        sprite.scale.x += 0.01;
        sprite.scale.y = sprite.scale.x;
    }

    if(pad1.connected) {
        var rightStickX = pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X);
        var rightStickY = pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y);

        if(rightStickX) {
            sprite.x += rightStickX * 10;
        }
        if(rightStickY) {
            sprite.y += rightStickY * 10;
        }
    }
}
