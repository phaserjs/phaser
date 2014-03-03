
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create, render: render });

function create() {

    game.stage.backgroundColor = '#454645';

    //  By default Phaser only starts 2 pointers (enough for 2 fingers at once)

    //  addPointer tells Phaser to add another pointer to Input, so here we are basically saying "allow up to 6 pointers + the mouse"

    //  Note: on iOS as soon as you use 6 fingers you'll active the minimise app gesture - and there's nothing we can do to stop that, sorry

    game.input.addPointer();
    game.input.addPointer();
    game.input.addPointer();
    game.input.addPointer();

}

function render() {

    //  Just renders out the pointer data when you touch the canvas
    game.debug.pointer(game.input.mousePointer);
    game.debug.pointer(game.input.pointer1);
    game.debug.pointer(game.input.pointer2);
    game.debug.pointer(game.input.pointer3);
    game.debug.pointer(game.input.pointer4);
    game.debug.pointer(game.input.pointer5);
    game.debug.pointer(game.input.pointer6);

}
