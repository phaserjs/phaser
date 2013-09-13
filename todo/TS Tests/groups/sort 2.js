(function() {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    // Wabbits inside this group is sorted by its "dead" property.
    // Dead wabbits behinds the others.
    var wabbits;

    function init() {
        game.load.image('wabbit', 'assets/sprites/wabbit.png');
        game.load.start();
    }
    function create() {
        // Create container group.
        wabbits = game.add.group();

        // Create wabbit and add to the container.
        var wabbe;
        for (var i = 0; i < 64; i++) {
            wabbe = wabbits.addNewSprite(Math.random() * 480 + 64, Math.random() * 480 + 32,
                'wabbit', 0,
                Phaser.Types.BODY_DISABLED);
            wabbe.transform.scale.setTo(2, 2);
            wabbe.transform.origin.setTo(0.5, 0.5);

            // Give wabbie a flag of living or not.
            wabbe.dead = false;

            wabbe.input.start(0, false, true);
            wabbe.events.onInputUp.add(killMe, this);
        }
    }
    function update() {
        // sort wabbies by "exists", so killed ones will
        wabbits.sort('dead', Phaser.Group.DESCENDING);
    }
    function render() {
        Phaser.DebugUtils.context.fillStyle = '#fff';
        Phaser.DebugUtils.context.fillText('Tap or click wabbits to kill them.', 32, 32);
    }
    function killMe(wabbe) {
        // Disable input.
        wabbe.input.stop();

        // Do not call the kill method, set its "dead" property instead.
        wabbe.dead = true;

        // Kill effects.
        game.add.tween(wabbe)
            .to({x: wabbe.x - 48}, 2000, Phaser.Easing.Linear.None, true, 0, false);
        game.add.tween(wabbe)
            .to({y: 640}, 2000 - wabbe.y, Phaser.Easing.Back.In, true, 0, false);
        game.add.tween(wabbe)
            .to({rotation: 240}, 1000, Phaser.Easing.Back.In, true, 0, false);
        game.add.tween(wabbe.transform.scale)
            .to({x: 2, y: 2}, 1000, Phaser.Easing.Bounce.In, true, 0, false);
    }
})();
