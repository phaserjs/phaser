/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    var circle1, circle2, circle3;
    var button;

    function init() {
        game.world.setSize(800, 600, true);
        game.load.image('blue', 'assets/tests/blue-circle.png');
        game.load.image('yellow', 'assets/tests/yellow-circle.png');
        game.load.image('magenta', 'assets/tests/magenta-circle.png');

        game.load.image('button', 'assets/tests/320x200.png');

        game.load.start();
    }
    function create() {
        circle1 = game.add.sprite(114, 34, 'blue');
        circle2 = game.add.sprite(426, 86, 'yellow');
        circle3 = game.add.sprite(221, 318, 'magenta');

        circle1.input.start(0, false, true);
        circle1.input.enableDrag(false);

        circle2.input.start(0, false, true);
        circle2.input.enableDrag(false);

        circle3.input.start(0, false, true);
        circle3.input.enableDrag(false);

        button = game.add.sprite(500, 100, 'button');
        button.input.start(0, false, true);
    }
    function update() {
        if (button.input.justReleased(0, 20)) {
            console.log('<1>: (' + circle1.x + ', ' + circle1.y + ')');
            console.log('<2>: (' + circle2.x + ', ' + circle2.y + ')');
            console.log('<3>: (' + circle3.x + ', ' + circle3.y + ')');
        }
    }
    function render() {
        circle1.input.renderDebugInfo(32, 32);
        circle2.input.renderDebugInfo(32, 160);
        circle3.input.renderDebugInfo(32, 296);
    }
})();
