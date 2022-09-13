var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
      preload: preload,
      create: create
    }
  };

  function preload() {
    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
  }

  function create() {
    this.add.image(400, 300, 'sky');

    var logo = this.add.image(400, 100, 'logo');

    var timeline = this.tweens.timeline({
      tweens: [
        {
          targets: logo,
          props: { x: 700 },
          duration: 200,
          onStart() { console.log('start 1')},
          onComplete() { console.log('complete 1')}
        },
        {
          targets: logo,
          props: { y: 500 },
          duration: 200,
          onStart() { console.log('start 2')},
          onComplete() { console.log('complete 2')}
        },
        {
          targets: logo,
          props: { x: 100 },
          duration: 200,
          onStart() { console.log('start 3')},
          onComplete() { console.log('complete 3')}
        },
        {
          targets: logo,
          props: { y: 100 },
          duration: 200,
          onStart() { console.log('start 4')},
          onComplete() { console.log('complete 4')}
        },
      ]
    })
  }

  var game = new Phaser.Game(config);
