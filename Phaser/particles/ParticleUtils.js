var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    (function (Particles) {
        var ParticleUtils = (function () {
            function ParticleUtils() {
            }
            ParticleUtils.initValue = function (value, defaults) {
                var value = (value != null && value != undefined) ? value : defaults;
                return value;
            };

            ParticleUtils.isArray = function (value) {
                return typeof value === 'object' && value.hasOwnProperty('length');
            };

            ParticleUtils.destroyArray = function (array) {
                array.length = 0;
            };

            ParticleUtils.destroyObject = function (obj) {
                for (var o in obj) {
                    delete obj[o];
                }
            };

            ParticleUtils.setSpanValue = function (a, b, c) {
                if (typeof b === "undefined") { b = null; }
                if (typeof c === "undefined") { c = null; }
                if (a instanceof Phaser.Particles.Span) {
                    return a;
                } else {
                    if (!b) {
                        return new Phaser.Particles.Span(a);
                    } else {
                        if (!c) {
                            return new Phaser.Particles.Span(a, b);
                        } else {
                            return new Phaser.Particles.Span(a, b, c);
                        }
                    }
                }
            };

            ParticleUtils.getSpanValue = function (pan) {
                if (pan instanceof Phaser.Particles.Span) {
                    return pan.getValue();
                } else {
                    return pan;
                }
            };

            ParticleUtils.randomAToB = function (a, b, INT) {
                if (typeof INT === "undefined") { INT = null; }
                if (!INT) {
                    return a + Math.random() * (b - a);
                } else {
                    return Math.floor(Math.random() * (b - a)) + a;
                }
            };

            ParticleUtils.randomFloating = function (center, f, INT) {
                return ParticleUtils.randomAToB(center - f, center + f, INT);
            };

            ParticleUtils.randomZone = function (display) {
            };

            ParticleUtils.degreeTransform = function (a) {
                return a * Math.PI / 180;
            };

            ParticleUtils.randomColor = //static toColor16 getRGB(num) {
            //    return "#" + num.toString(16);
            //}
            function () {
                return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
            };

            ParticleUtils.setEasingByName = function (name) {
                switch (name) {
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
            };
            return ParticleUtils;
        })();
        Particles.ParticleUtils = ParticleUtils;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
