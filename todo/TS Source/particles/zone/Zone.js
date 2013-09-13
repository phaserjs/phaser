var Phaser;
(function (Phaser) {
    (function (Particles) {
        /// <reference path="../../_definitions.ts" />
        (function (Zones) {
            var Zone = (function () {
                function Zone() {
                    this.vector = new Phaser.Vec2();
                    this.random = 0;
                    this.crossType = "dead";
                    this.alert = true;
                }
                return Zone;
            })();
            Zones.Zone = Zone;            
        })(Particles.Zones || (Particles.Zones = {}));
        var Zones = Particles.Zones;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
