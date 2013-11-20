PIXI.TunnelFilter = function(width, height, texture)
{
	PIXI.AbstractFilter.call( this );
	
	this.passes = [this];

	var d = new Date();

	var dates = [
		d.getFullYear(), // the year (four digits)
		d.getMonth(),	   // the month (from 0-11)
		d.getDate(),     // the day of the month (from 1-31)
		d.getHours()*60.0*60 + d.getMinutes()*60 + d.getSeconds()
	];

	this.uniforms = {
		iResolution: { type: 'f3', value: { x: width, y: height, z: 0 }},
		iGlobalTime: { type: 'f', value: 1 },
		iDate: { type: 'f4', value: dates },
		iChannel0: { type: 'sampler2D', value: texture, wrap: 'nearest-repeat' }
	};

	//	Shader by reiska (https://www.shadertoy.com/view/4sX3z7)
	this.fragmentSrc = [
		"precision mediump float;",
		"uniform vec3      iResolution;",
		"uniform float     iGlobalTime;",
		"uniform float     iChannelTime[4];",
		"uniform vec4      iMouse;",
		"uniform vec4      iDate;",
		"uniform vec3      iChannelResolution[4];",
		"uniform sampler2D iChannel0;",
		"// add any extra uniforms here",

		"void main(void)",
		"{",
			"float cameraPinch = 1.0; // values between 0 - 2, this will modify (pinch) the view",
			"float cameraZPinch = 1.0; //",
			"float cameraZFactor = 1.0; // 0-1",
			"float zoomFactor = 1.0; // large values will create a kaleidoscopic effect!",

			"float texCoordUScale = 0.125;",
			"float texCoordVScale = 1.0;",

			"float texCoordUMoveSpeed = 0.20;",
			"float texCoordVMoveSpeed = -0.125;",

			"float cameraRotationSpeed = 0.5; // 0.0 to switch off rotation (look straight ahead)",

			"float tunnelPinch = 2.0; // 1.0 = round tunnel, change the value to modify the shape",

			"float spikeCount = 5.0;",
			"float spikeFactor = sin(iGlobalTime) * 0.1;	// 0.0 to switch off spikes",

			"vec3 fogColor = vec3(0.0, 0.0, 0.0);",
			"float fogPower = 10.0;",

			"vec2 coord = 2.0 * ((gl_FragCoord.xy / iResolution.xy) - vec2(0.5, 0.5));",

			"float aspectRatio = iResolution.x / iResolution.y;",

			"coord.x *= aspectRatio;",
			"coord *= zoomFactor;",

			"coord = vec2(sign(coord.x) * pow(abs(coord.x), cameraPinch), sign(coord.y) * pow(abs(coord.y), cameraPinch));",

			"// camera angles",
			"float camAng = iGlobalTime * cameraRotationSpeed;",

			"// camera rotation vectors",
			"vec3 cx = vec3(cos(camAng), 0.0, -sin(camAng));",
			"vec3 cy = vec3(0.0, 1.0, 0.0);",
			"vec3 cz = vec3(sin(camAng), 0.0, cos(camAng));",

			"mat3 cameraRot =",
			"mat3(",
			"cx.x, cx.y, cx.z,",
			"cy.x, cy.y, cy.z,",
			"cz.x, cz.y, cz.z);",

			"vec3 cameraDir = normalize(vec3(sin(coord.x), sin(coord.y), cos(coord.x) * cos(coord.y)));",

			"cameraDir = cameraRot * cameraDir;",

			"float angle = atan(cameraDir.x, cameraDir.y);",
			"cameraDir.z *= 1.0 + sin(angle * spikeCount) * spikeFactor;",

			"cameraDir.z = cameraZFactor * sign(cameraDir.z) * pow(abs(cameraDir.z), cameraZPinch);",


			"vec3 cameraOrigin = vec3(0.0, 0.0, 0.0);",

			"float l = sqrt(pow(cameraDir.x * cameraDir.x, tunnelPinch) + pow(cameraDir.y * cameraDir.y, tunnelPinch));",
			"float d = 1.0 / l;",

			"vec3 hitPos = cameraOrigin + cameraDir * d;",


			"vec2 uv = vec2(hitPos.z, angle / 3.14159);",
			"uv.x = uv.x * texCoordUScale + iGlobalTime * texCoordUMoveSpeed;",
			"uv.y = uv.y * texCoordVScale + iGlobalTime * texCoordVMoveSpeed;",
			"vec3 color = texture2D(iChannel0, uv).rgb;",

			"float alpha = 1.0 - pow(min(1.0, abs(cameraDir.z)), fogPower);",

			"color = fogColor * (1.0 - alpha) + color * alpha;",

			"gl_FragColor = vec4(color, 1.0);",
		"}"];



}

PIXI.TunnelFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.TunnelFilter.prototype.constructor = PIXI.TunnelFilter;

Object.defineProperty(PIXI.TunnelFilter.prototype, 'iGlobalTime', {
    get: function() {
        return this.uniforms.iGlobalTime.value;
    },
    set: function(value) {
    	this.uniforms.iGlobalTime.value = value;
    }
});

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('texture', 'wip/tex15.png');

}

var filter;
var sprite;

function create() {

	sprite = game.add.sprite(0, 0, 'texture');
	sprite.width = 800;
	sprite.height = 600;

	filter = new PIXI.TunnelFilter(sprite.width, sprite.height, sprite.texture);

	sprite.filters = [filter];

}

function update() {

	filter.iGlobalTime = game.time.totalElapsedSeconds();

}

function render() {
}
