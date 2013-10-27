var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var ufo;
var ufoSpeed = 200;

function preload() {
    game.world.setBounds(0,0,800, 600);
    game.load.image('ufo', 'assets/sprites/ufo.png');
}

function create() {
    // Create a ufo sprite as player.
    ufo = game.add.sprite(320, 240, 'ufo');
    ufo.anchor.setTo(0.5, 0.5);

    // Use Austin Hallock's HTML5 Virtual Game Controller
    // https://github.com/austinhallock/html5-virtual-game-controller/
    // Note: you must also require gamecontroller.js on your host page.

    // Init game controller with left thumb stick
    GameController.init({
        left: {
            type: 'joystick',
            joystick: {
                touchStart: function() {
                    // Don't need this, but the event is here if you want it.
                },
                touchMove: function(joystick_details) {
                    game.input.joystickLeft = joystick_details;
                },
                touchEnd: function() {
                    game.input.joystickLeft = null;
                }
            }
        },
        right: {
            // We're not using anything on the right for this demo, but you can add buttons, etc.
            // See https://github.com/austinhallock/html5-virtual-game-controller/ for examples.
            type: 'none'
        }
    });

    // This is an ugly hack to get this to show up over the Phaser Canvas
    // (which has a manually set z-index in the example code) and position it in the right place,
    // because it's positioned relatively...
    // You probably don't need to do this in your game unless your game's canvas is positioned in a manner
    // similar to this example page, where the canvas isn't the whole screen.
    $('canvas').last().css('z-index', 20);
    $('canvas').last().offset( $('canvas').first().offset() );
}

function update() {
    // Check key states every frame.
    if (game.input.joystickLeft) {
        // Move the ufo using the joystick's normalizedX and Y values,
        // which range from -1 to 1.
        ufo.body.velocity.setTo(game.input.joystickLeft.normalizedX * 200, game.input.joystickLeft.normalizedY * ufoSpeed * -1);
    }
    else {
        ufo.body.velocity.setTo(0, 0);
    }
}

function render() {
    game.debug.renderText('Use the virtual joystick to move the UFO.', 20, 20);
    game.debug.renderText('This requires touch events, so try on your phone.', 20, 40);
}

