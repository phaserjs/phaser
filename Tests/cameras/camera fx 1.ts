/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, null, render);

    var btn1: Phaser.Button,
        btn2: Phaser.Button,
        btn3: Phaser.Button;
    var fx;

    function init() {
        game.world.setSize(800, 600, true);
        game.load.image('blue', 'assets/tests/blue-circle.png');
        game.load.image('yellow', 'assets/tests/yellow-circle.png');
        game.load.image('magenta', 'assets/tests/magenta-circle.png');

        game.load.start();
    }
    function create() {
        btn1 = game.add.button(114, 34, 'blue', simpleFade, this);
        btn2 = game.add.button(426, 86, 'yellow', forceFade, this);
        btn3 = game.add.button(221, 318, 'magenta', fadeWithCallback, this);

        fx = game.camera.fx.add(Phaser.FX.Camera.Fade);
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Press to fade.', 114 + 90, 34 + 130);
        Phaser.DebugUtils.context.fillText('Force to fade every time you press it.', 426 + 20, 86 + 130);
        Phaser.DebugUtils.context.fillText('Popup a window when fade finished.', 221 + 30, 318 + 130);
    }
    function simpleFade() {
        // Simply fade to black in 0.5 seconds.
        fx.start(0x330033, 0.5);
    }
    function forceFade() {
        // Force restart fade effect each time you pressed the button.
        fx.start(0x003333, 0.5, null, true);
    }
    function fadeWithCallback() {
        // Popup a alert window when fade finished.
        fx.start(0x333300, 0.5, function() {
            alert('Fade finished!');
        });
    }
})();
