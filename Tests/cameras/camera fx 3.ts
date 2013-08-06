/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    var btn1: Phaser.UI.Button,
        btn2: Phaser.UI.Button,
        btn3: Phaser.UI.Button;
    var fx;

    function init() {
        game.world.setSize(800, 600, true);
        game.load.image('blue', 'assets/tests/blue-circle.png');
        game.load.image('yellow', 'assets/tests/yellow-circle.png');
        game.load.image('magenta', 'assets/tests/magenta-circle.png');

        game.load.start();
    }
    function create() {
        btn1 = game.add.button(114, 34, 'blue', simpleShake, this);
        btn2 = game.add.button(426, 86, 'yellow', forceShake, this);
        btn3 = game.add.button(221, 318, 'magenta', shakeWithCallback, this);

        // Usage of shake fx is the same as fade and flash.
        fx = game.camera.fx.add(Phaser.FX.Camera.Shake);
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Press to shake.', 114 + 90, 34 + 130);
        Phaser.DebugUtils.context.fillText('Force to shake every time you press it.', 426 + 20, 86 + 130);
        Phaser.DebugUtils.context.fillText('Popup a window when shake finished.', 221 + 30, 318 + 130);
    }
    function simpleShake() {
        // Simply shake to black in 0.5 seconds.
        fx.start(0x330033, 0.5);
    }
    function forceShake() {
        // Force restart shake effect each time you pressed the button.
        fx.start(0x003333, 0.5, null, true);
    }
    function shakeWithCallback() {
        // Popup a alert window when shake finished.
        fx.start(0x333300, 0.5, function() {
            alert('Shake finished!');
        });
    }
})();
