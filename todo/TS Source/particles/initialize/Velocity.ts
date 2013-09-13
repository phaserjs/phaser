/// <reference path="../../_definitions.ts" />

module Phaser.Particles.Initializers {

    export class Velocity extends Initialize {

        constructor(rpan, thapan, type) {
            super();

            this.rPan = ParticleUtils.setSpanValue(rpan);
            this.thaPan = ParticleUtils.setSpanValue(thapan);
            this.type = ParticleUtils.initValue(type, 'vector');
        }

        rPan: Phaser.Particles.Span;
        thaPan: Phaser.Particles.Span;
        type;

        reset(rpan, thapan, type) {
            this.rPan = ParticleUtils.setSpanValue(rpan);
            this.thaPan = ParticleUtils.setSpanValue(thapan);
            this.type = ParticleUtils.initValue(type, 'vector');
        }

        normalizeVelocity(vr) {
            return vr * ParticleManager.MEASURE;
        }

        initialize(target) {

            if (this.type == 'p' || this.type == 'P' || this.type == 'polar')
            {
                var polar2d = new Polar2D(this.normalizeVelocity(this.rPan.getValue()), this.thaPan.getValue() * Math.PI / 180);
                target.v.x = polar2d.getX();
                target.v.y = polar2d.getY();
            }
            else
            {
                target.v.x = this.normalizeVelocity(this.rPan.getValue());
                target.v.y = this.normalizeVelocity(this.thaPan.getValue());
            }
        }

    }

}
