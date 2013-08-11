/// <reference path="../_definitions.ts" />

module Phaser.Particles {

    export class Span {

        constructor(a, b = null, center = null) {

            this.isArray = false;

            if (ParticleUtils.isArray(a))
            {
                this.isArray = true;
                this.a = a;
            }
            else
            {
                this.a = ParticleUtils.initValue(a, 1);
                this.b = ParticleUtils.initValue(b, this.a);
                this.center = ParticleUtils.initValue(center, false);
            }

        }

        a;
        b;
        c;
        center;
        isArray;

        getValue(INT = null) {

            if (this.isArray)
            {
                return this.a[Math.floor(this.a.length * Math.random())];
            }
            else
            {
                if (!this.center)
                {
                    return ParticleUtils.randomAToB(this.a, this.b, INT);
                }
                else
                {
                    return ParticleUtils.randomFloating(this.a, this.b, INT);
                }
            }

        }

        static getSpan(a, b, center) {
            return new Span(a, b, center);
        }

    }

}
