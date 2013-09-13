var Phaser;
(function (Phaser) {
    /// <reference path="../math/Vec2.ts" />
    /// <reference path="../math/Vec2Utils.ts" />
    /// <reference path="AdvancedPhysics.ts" />
    /// <reference path="Body.ts" />
    /// <reference path="shapes/Shape.ts" />
    /**
    * Phaser - Advanced Physics - Contact
    *
    * Based on the work Ju Hyung Lee started in JS PhyRus.
    */
    (function (Physics) {
        var Contact = (function () {
            function Contact(p, n, d, hash) {
                this.hash = hash;
                this.point = p;
                this.normal = n;
                this.depth = d;
                this.lambdaNormal = 0;
                this.lambdaTangential = 0;
                this.r1 = new Phaser.Vec2();
                this.r2 = new Phaser.Vec2();
                this.r1_local = new Phaser.Vec2();
                this.r2_local = new Phaser.Vec2();
            }
            return Contact;
        })();
        Physics.Contact = Contact;        
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
