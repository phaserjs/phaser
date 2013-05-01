/// <reference path="../Game.d.ts" />
module Phaser {
    class RandomDataGenerator {
        constructor(seeds?: string[]);
        private s0;
        private s1;
        private s2;
        private c;
        private uint32();
        private fract32();
        private rnd();
        private hash(data);
        public sow(seeds?: string[]): void;
        public integer : number;
        public frac : number;
        public real : number;
        public integerInRange(min: number, max: number): number;
        public realInRange(min: number, max: number): number;
        public normal : number;
        public uuid : string;
        public pick(array);
        public weightedPick(array);
        public timestamp(min?: number, max?: number): number;
        public angle : number;
    }
}
