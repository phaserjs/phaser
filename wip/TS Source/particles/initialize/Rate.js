var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Phaser;
(function (Phaser) {
    (function (Particles) {
        /// <reference path="../../_definitions.ts" />
        (function (Initializers) {
            var Rate = (function (_super) {
                __extends(Rate, _super);
                function Rate(numpan, timepan) {
                                _super.call(this);
                    numpan = Particles.ParticleUtils.initValue(numpan, 1);
                    timepan = Particles.ParticleUtils.initValue(timepan, 1);
                    this.numPan = new Phaser.Particles.Span(numpan);
                    this.timePan = new Phaser.Particles.Span(timepan);
                    this.startTime = 0;
                    this.nextTime = 0;
                    this.init();
                }
                Rate.prototype.init = function () {
                    this.startTime = 0;
                    this.nextTime = this.timePan.getValue();
                };
                Rate.prototype.getValue = function (time) {
                    this.startTime += time;
                    if(this.startTime >= this.nextTime) {
                        this.startTime = 0;
                        this.nextTime = this.timePan.getValue();
                        if(this.numPan.b == 1) {
                            if(this.numPan.getValue(false) > 0.5) {
                                return 1;
                            } else {
                                return 0;
                            }
                        } else {
                            return this.numPan.getValue(true);
                        }
                    }
                    return 0;
                };
                return Rate;
            })(Initializers.Initialize);
            Initializers.Rate = Rate;            
        })(Particles.Initializers || (Particles.Initializers = {}));
        var Initializers = Particles.Initializers;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
