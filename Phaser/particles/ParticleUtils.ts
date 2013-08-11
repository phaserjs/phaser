/// <reference path="../_definitions.ts" />

module Phaser.Particles {

    export class ParticleUtils {

        static initValue(value, defaults) {
            var value = (value != null && value != undefined) ? value : defaults;
            return value;
        }

        static isArray(value) {
            return typeof value === 'object' && value.hasOwnProperty('length');
        }

        static destroyArray(array) {
            array.length = 0;
        }

        static destroyObject(obj) {

            for (var o in obj)
            {
                delete obj[o];
            }

        }

        static setSpanValue(a, b= null, c= null) {

            if (a instanceof Phaser.Particles.Span)
            {
                return a;
            }
            else
            {
                if (!b)
                {
                    return new Phaser.Particles.Span(a);
                }
                else
                {
                    if (!c)
                    {
                        return new Phaser.Particles.Span(a, b);
                    }
                    else
                    {
                        return new Phaser.Particles.Span(a, b, c);
                    }
                }
            }
        }

        static getSpanValue(pan) {

            if (pan instanceof Phaser.Particles.Span)
            {
                return pan.getValue();
            }
            else
            {
                return pan;
            }

        }

        static randomAToB(a, b, INT = null) {

            if (!INT)
            {
                return a + Math.random() * (b - a);
            }
            else
            {
                return Math.floor(Math.random() * (b - a)) + a;
            }

        }

        static randomFloating(center, f, INT) {
            return ParticleUtils.randomAToB(center - f, center + f, INT);
        }

        static randomZone(display) {

        }

        static degreeTransform(a) {
            return a * Math.PI / 180;
        }

        //static toColor16 getRGB(num) {
        //    return "#" + num.toString(16);
        //}

        static randomColor() {
            return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
        }

        static setEasingByName(name) {

            switch (name)
            {
                case 'easeLinear':
                    return Phaser.Easing.Linear.None;
                    break;

                case 'easeInQuad':
                    return Phaser.Easing.Quadratic.In;
                    break;

                case 'easeOutQuad':
                    return Phaser.Easing.Quadratic.Out;
                    break;

                case 'easeInOutQuad':
                    return Phaser.Easing.Quadratic.InOut;
                    break;

                case 'easeInCubic':
                    return Phaser.Easing.Cubic.In;
                    break;

                case 'easeOutCubic':
                    return Phaser.Easing.Cubic.Out;
                    break;

                case 'easeInOutCubic':
                    return Phaser.Easing.Cubic.InOut;
                    break;

                case 'easeInQuart':
                    return Phaser.Easing.Quartic.In;
                    break;

                case 'easeOutQuart':
                    return Phaser.Easing.Quartic.Out;
                    break;

                case 'easeInOutQuart':
                    return Phaser.Easing.Quartic.InOut;
                    break;

                case 'easeInSine':
                    return Phaser.Easing.Sinusoidal.In;
                    break;

                case 'easeOutSine':
                    return Phaser.Easing.Sinusoidal.Out;
                    break;

                case 'easeInOutSine':
                    return Phaser.Easing.Sinusoidal.InOut;
                    break;

                case 'easeInExpo':
                    return Phaser.Easing.Exponential.In;
                    break;

                case 'easeOutExpo':
                    return Phaser.Easing.Exponential.Out;
                    break;

                case 'easeInOutExpo':
                    return Phaser.Easing.Exponential.InOut;
                    break;

                case 'easeInCirc':
                    return Phaser.Easing.Circular.In;
                    break;

                case 'easeOutCirc':
                    return Phaser.Easing.Circular.Out;
                    break;

                case 'easeInOutCirc':
                    return Phaser.Easing.Circular.InOut;
                    break;

                case 'easeInBack':
                    return Phaser.Easing.Back.In;
                    break;

                case 'easeOutBack':
                    return Phaser.Easing.Back.Out;
                    break;

                case 'easeInOutBack':
                    return Phaser.Easing.Back.InOut;
                    break;

                default:
                    return Phaser.Easing.Linear.None;
                    break;
            }
        }

    }

}
