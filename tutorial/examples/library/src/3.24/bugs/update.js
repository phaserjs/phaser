function preload() {
	this.load.spritesheet('example', 'https://i.imgur.com/aJaz94K.png', {
  	frameWidth: 23,
    frameHeight: 26
  })
}

function create() {
	this.anims.create({
  	key: 'flash',
    frames: this.anims.generateFrameNumbers('example', { start: 1, end: 4 }),
    frameRate: 4,
  	repeat: -1
  })

  // spriteA animates correctly
	const contA = this.add.container(2, 2)
  this.spriteA = this.add.sprite(0, 0, 'example')
  this.spriteA.setOrigin(0, 0)
	contA.add(this.spriteA)

  // spriteB only displays the first frame of animation
  const contB = this.add.container(25, 2)
  this.spriteB = new Phaser.GameObjects.Sprite(this, 0, 0, 'example')
  this.spriteB.setOrigin(0, 0)
  contB.add(this.spriteB)

	this.input.on('pointerdown', e => {
  	this.spriteA.play('flash')
    this.spriteB.play('flash')
  })
}

const config = {
	type: Phaser.AUTO,
	width: 50,
  height: 30,
  zoom: 4,
  scene: { preload, create },
  render: { pixelArt: true }
}

new Phaser.Game(config)
