var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create});
var counter = 0
var explicitlyPaused = false

function create() {
    game.stage.backgroundColor = '#6688ee';
    timer = game.time.create(false);
    timer.repeat(Phaser.Timer.SECOND, 10, step, this);

    game.onPause.add(handleGamePaused)
    game.onResume.add(handleGameResumed)

    //prevent init tick error
    setTimeout(function(){
      timer.start()  
    }, 250)

}
function handleGamePaused(){
  console.log('game paused')
}
function handleGameResumed(){
  console.log('game resumed')
}

function step(){
  counter++ 
  console.log('timer step', counter)

  if(counter == 3){
    pauseTimer()
  }
  if(counter > 3){
    console.log('this should never happen! Paused since step #3')
  }
}
function pauseTimer(){
  if(explicitlyPaused) return
  console.log('pause timer triggered')
  explicitlyPaused = true
  timer.pause()
}