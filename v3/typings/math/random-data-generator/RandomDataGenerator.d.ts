export default class RandomDataGenerator {
    /**
    * @property {number} c - Internal var.
    * @private
    */
    private c;
    /**
    * @property {number} s0 - Internal var.
    * @private
    */
    private s0;
    /**
    * @property {number} s1 - Internal var.
    * @private
    */
    private s1;
    /**
    * @property {number} s2 - Internal var.
    * @private
    */
    private s2;
    /**
    * @property {Array} sign - Internal var.
    * @private
    */
    static sign: number[];
    /**
    * Private random helper.
    *
    * @method Phaser.RandomDataGenerator#rnd
    * @private
    * @return {number}
    */
    private rnd();
    /**
    * Internal method that creates a seed hash.
    *
    * @method Phaser.RandomDataGenerator#hash
    * @private
    * @param {any} data
    * @return {number} hashed value.
    */
    private hash(data);
    constructor(seeds: any);
    /**
    * Reset the seed of the random data generator.
    *
    * _Note_: the seed array is only processed up to the first `undefined` (or `null`) value, should such be present.
    *
    * @method Phaser.RandomDataGenerator#sow
    * @param {any[]} seeds - The array of seeds: the `toString()` of each value is used.
    */
    sow(seeds: any): void;
    /**
    * Returns a random integer between 0 and 2^32.
    *
    * @method Phaser.RandomDataGenerator#integer
    * @return {number} A random integer between 0 and 2^32.
    */
    integer(): number;
    /**
    * Returns a random real number between 0 and 1.
    *
    * @method Phaser.RandomDataGenerator#frac
    * @return {number} A random real number between 0 and 1.
    */
    frac(): number;
    /**
    * Returns a random real number between 0 and 2^32.
    *
    * @method Phaser.RandomDataGenerator#real
    * @return {number} A random real number between 0 and 2^32.
    */
    real(): number;
    /**
    * Returns a random integer between and including min and max.
    *
    * @method Phaser.RandomDataGenerator#integerInRange
    * @param {number} min - The minimum value in the range.
    * @param {number} max - The maximum value in the range.
    * @return {number} A random number between min and max.
    */
    integerInRange(min: any, max: any): number;
    /**
    * Returns a random integer between and including min and max.
    * This method is an alias for RandomDataGenerator.integerInRange.
    *
    * @method Phaser.RandomDataGenerator#between
    * @param {number} min - The minimum value in the range.
    * @param {number} max - The maximum value in the range.
    * @return {number} A random number between min and max.
    */
    between(min: any, max: any): number;
    /**
    * Returns a random real number between min and max.
    *
    * @method Phaser.RandomDataGenerator#realInRange
    * @param {number} min - The minimum value in the range.
    * @param {number} max - The maximum value in the range.
    * @return {number} A random number between min and max.
    */
    realInRange(min: any, max: any): any;
    /**
    * Returns a random real number between -1 and 1.
    *
    * @method Phaser.RandomDataGenerator#normal
    * @return {number} A random real number between -1 and 1.
    */
    normal(): number;
    /**
    * Returns a valid RFC4122 version4 ID hex string from https://gist.github.com/1308368
    *
    * @method Phaser.RandomDataGenerator#uuid
    * @return {string} A valid RFC4122 version4 ID hex string
    */
    uuid(): any;
    /**
    * Returns a random member of `array`.
    *
    * @method Phaser.RandomDataGenerator#pick
    * @param {Array} array - An Array to pick a random member of.
    * @return {any} A random member of the array.
    */
    pick(array: any): any;
    /**
    * Returns a sign to be used with multiplication operator.
    *
    * @method Phaser.RandomDataGenerator#sign
    * @return {number} -1 or +1.
    */
    sign(): any;
    /**
    * Returns a random member of `array`, favoring the earlier entries.
    *
    * @method Phaser.RandomDataGenerator#weightedPick
    * @param {Array} array - An Array to pick a random member of.
    * @return {any} A random member of the array.
    */
    weightedPick(array: any): any;
    /**
    * Returns a random timestamp between min and max, or between the beginning of 2000 and the end of 2020 if min and max aren't specified.
    *
    * @method Phaser.RandomDataGenerator#timestamp
    * @param {number} min - The minimum value in the range.
    * @param {number} max - The maximum value in the range.
    * @return {number} A random timestamp between min and max.
    */
    timestamp(min: any, max: any): any;
    /**
    * Returns a random angle between -180 and 180.
    *
    * @method Phaser.RandomDataGenerator#angle
    * @return {number} A random number between -180 and 180.
    */
    angle(): number;
    /**
    * Returns a random rotation in radians, between -3.141 and 3.141
    *
    * @method Phaser.RandomDataGenerator#rotation
    * @return {number} A random number between -3.141 and 3.141
    */
    rotation(): any;
    /**
    * Gets or Sets the state of the generator. This allows you to retain the values
    * that the generator is using between games, i.e. in a game save file.
    *
    * To seed this generator with a previously saved state you can pass it as the
    * `seed` value in your game config, or call this method directly after Phaser has booted.
    *
    * Call this method with no parameters to return the current state.
    *
    * If providing a state it should match the same format that this method
    * returns, which is a string with a header `!rnd` followed by the `c`,
    * `s0`, `s1` and `s2` values respectively, each comma-delimited.
    *
    * @method Phaser.RandomDataGenerator#state
    * @param {string} [state] - Generator state to be set.
    * @return {string} The current state of the generator.
    */
    state(state: any): string;
}
