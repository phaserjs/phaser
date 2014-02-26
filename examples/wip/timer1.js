var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create });

var last;
var i = 0;

function create() {

  //Maybe you have to set it even lower for your machine.
  //It's related to the time Phaser needs to boot up.
  //The tick stops being negative and behaves nearly normal for me at around 550 - 600ms

  delay = 250;
  foreverTimer = game.time.events.repeat(delay, 10, handleEvent, this);

  last = Date.now();

  console.log('create started', last);

}

function handleEvent() {

	console.log('>> Tick', i, 'ms diff:', Date.now() - last);

	last = Date.now();

	i++;

}