
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { render:render  });

var rect = new Phaser.Rectangle( 100, 100, 100, 100 ) ;
var circle = new Phaser.Circle( 280, 150, 100 ) ;
var point = new Phaser.Point( 100, 280 ) ;

function render() {

    // Draw debug tools
    game.debug.renderRectangle( rect, 'rgba(255,0,0,1)' ) ;
    game.debug.renderCircle( circle, 'rgba(255,255,0,1)' ) ;
    game.debug.renderPoint( point, 'rgba(255,255,255,1)' ) ;
    game.debug.renderPixel( 200, 280, 'rgba(0,255,255,1)' ) ;
    game.debug.renderText( "This is debug text", 100, 380 );


}
