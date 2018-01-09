
export default class ObservableVec2 {

    constructor (callback, x = 0, y = 0) {

        //  This may look ugly, but it allows for seamless exchange between
        //  Vec2, Float32Array and Array data types.

        this.onUpdate = callback;
        this[0] = x;
        this[1] = y;

    }

    get x () {
        return this[0];
    }

    get y () {
        return this[1];
    }

    set x (v) {
        this.onUpdate(v, this[1], this[0], this[1]);
        this[0] = v;
    }

    set y (v) {
        this.onUpdate(this[0], v, this[0], this[1]);
        this[1] = v;
    }

    set (x, y = x) {

        this.onUpdate(x, y, this[0], this[1]);
        this[0] = x;
        this[1] = y;

        return this;

    }

    setTo (x, y = x) {

        this.onUpdate(x, y, this[0], this[1]);
        this[0] = x;
        this[1] = y;

        return this;

    }

    zero () {

        this.onUpdate(0, 0, this[0], this[1]);
        this[0] = 0;
        this[1] = 0;

        return this;

    }

    add (v) {

        this.onUpdate(x, y, this[0], this[1]);
        this[0] += v[0];
        this[1] += v[1];

        return this;

    }

    addScalar (s) {

        this[0] += s;
        this[1] += s;

        return this;

    }

    addVectors (a, b) {

        this[0] = a[0] + b[0];
        this[1] = a[1] + b[1];

        return this;

    }

    addScaledVector (v, s) {

        this[0] += v[0] * s;
        this[1] += v[1] * s;

        return this;

    }

    sub (v) {

        this[0] -= v[0];
        this[1] -= v[1];

        return this;

    }

    subScalar (s) {

        this[0] -= s;
        this[1] -= s;

        return this;

    }

    subVectors (a, b) {

        this[0] = a[0] - b[0];
        this[1] = a[1] - b[1];

        return this;

    }

    //  Same as scaleV, kept for compatibility between 3rd party libs
    multiply (v) {

        this[0] *= v[0];
        this[1] *= v[1];

        return this;

    }

    multiplyScalar (s) {

        if (isFinite(s))
        {
            this[0] *= s;
            this[1] *= s;
        }
        else
        {
            this[0] = 0;
            this[1] = 0;
        }

        return this;

    }

    scale (x, y = x) {

        this[0] *= x;
        this[1] *= y;

        return this;

    }

    scaleV (v) {

        this[0] *= v[0];
        this[1] *= v[1];

        return this;

    }

    divide (n) {

        this[0] /= n;
        this[1] /= n;

        return this;

    }

    divideScalar (s) {

        const c = 1 / s;

        if (isFinite(c))
        {
            this[0] *= c;
            this[1] *= c;
        }
        else
        {
            this[0] = 0;
            this[1] = 0;
        }

        return this;

    }

    min (v) {

        this[0] = Math.min(this[0], v[0]);
        this[1] = Math.min(this[1], v[1]);

        return this;

    }

    max (v) {

        this[0] = Math.max(this[0], v[0]);
        this[1] = Math.max(this[1], v[1]);

        return this;

    }

    clamp (min, max) {

        // This function assumes min < max, if this assumption isn't true it will not operate correctly

        this[0] = Math.max(min[0], Math.min(max[0], this[0]));
        this[1] = Math.max(min[1], Math.min(max[1], this[1]));

        return this;

    }

    floor () {

        this[0] = Math.floor(this[0]);
        this[1] = Math.floor(this[1]);

        return this;

    }

    ceil () {

        this[0] = Math.ceil(this[0]);
        this[1] = Math.ceil(this[1]);

        return this;

    }

    round () {

        this[0] = Math.round(this[0]);
        this[1] = Math.round(this[1]);

        return this;

    }

    roundToZero () {

        if (this[0] < 0)
        {
            this[0] = Math.ceil(this[0]);
        }
        else
        {
            this[0] = Math.floor(this[0]);
        }

        if (this[1] < 1)
        {
            this[1] = Math.ceil(this[1]);
        }
        else
        {
            this[1] = Math.floor(this[1]);
        }

        return this;

    }

    negate () {

        this[0] = -this[0];
        this[1] = -this[1];

        return this;

    }

    normalize () {

        let l = this.length();

        if (l > 0)
        {
            this[0] /= l;
            this[1] /= l;
        }

        return this;

    }

    perp () {

        let x = this[0];
        let y = this[1];

        this[0] = y;
        this[1] = -x;

        return this;

    }

    dot (v) {

        return this[0] * v[0] + this[1] * v[1];

    }

    lengthSq () {

        return this[0] * this[0] + this[1] * this[1];

    }

    set length (v) {

        const angle = Math.atan2(this[1], this[0]);

        this[0] = Math.cos(angle) * v;
        this[1] = Math.sin(angle) * v;

    }

    get length () {

        return Math.sqrt(this[0] * this[0] + this[1] * this[1]);

    }

    lengthManhattan () {

        return Math.abs(this[0]) + Math.abs(this[1]);

    }

    toString () {

        return `[Vec2 (x=${this[0]}, y=${this[1]})]`;

    }

}