
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);

}

var mummy;
var anim;
var s = [];
var t;

function create() {

	game.stage.backgroundColor = 0x3d4d3d;

    mummy = game.add.sprite(0, 300, 'mummy', 5);
    // mummy.scale.set(2);

    anim = mummy.animations.add('walk');

    anim.play(10, true);

    // game.onPause.add(paused, this);
    // game.onResume.add(resumed, this);

    game.add.tween(mummy.scale).to({x:4,y:4}, 1000, Phaser.Easing.Linear.None, true);
    t = game.add.tween(mummy).to({x:700}, 15000, Phaser.Easing.Linear.None, true);
    t.onComplete.add(tweenOver, this);

    s.push('starting: ' + game.stage._hiddenVar);

    game.input.onDown.add(pauseTween, this);

}

function pauseTween(pointer) {

	if (pointer.x < 400)
	{
		t.pause();
	}
	else
	{
		t.resume();
	}

}

function tweenOver() {
	console.log('yay all over after 15 seconds anyway');
}

/*function pauseToggle() {

	if (game.paused)
	{
		game.paused = false;
	}
	else
	{
		game.paused = true;
	}

}
function paused() {

	s.push('paused now: ' + game.time.now);
	console.log('paused now: ' + game.time.now);

}

function resumed() {

	s.push('resumed now: ' + game.time.now);
	console.log('resumed now: ' + game.time.now);
	s.push('pause duration: ' + game.time.pauseDuration);

}
*/

function update() {

}

function render() {

	for (var i = 0; i < s.length; i++)
	{
		game.debug.text(s[i], 16, 160 + (16 * i));
	}
	
}