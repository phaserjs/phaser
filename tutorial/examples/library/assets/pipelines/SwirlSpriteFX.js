/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 */

 const fragShader = `
 #define SHADER_NAME SWIRL_FS

 precision mediump float;

 uniform sampler2D uMainSampler;
 uniform vec2 uResolution;
 uniform vec2 uCoords;
 uniform float uRadius;
 uniform float uStrength;

 varying vec2 outTexCoord;

 #define PI 3.14159

 void main ()
 {
     float effectAngle = uStrength * PI;

     vec2 uv = outTexCoord - uCoords;

     float len = length(uv * vec2(uResolution.x / uResolution.y, 1.0));
     float angle = atan(uv.y, uv.x) + effectAngle * smoothstep(uRadius, 0.0, len);
     float radius = length(uv);

     gl_FragColor = texture2D(uMainSampler, vec2(radius * cos(angle), radius * sin(angle)) + uCoords);
 }
 `;

 export default class SwirlSpriteFX extends Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline
 {
     constructor (game)
     {
         super({
             game,
             fragShader
         });

         this.x = 0.5;
         this.y = 0.5;
         this.radius = 0.25;
         this.strength = 1;
     }

     onPreRender ()
     {
         this.set2f('uCoords', this.x, this.y);
         this.set1f('uRadius', this.radius);
         this.set1f('uStrength', this.strength);
     }

     onDraw (renderTarget)
     {
         this.set2f('uResolution', renderTarget.width, renderTarget.height);

         this.drawToGame(renderTarget);
     }
 }
