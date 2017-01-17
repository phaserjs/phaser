export default class IndexBuffer {
    wordLength: any;
    wordCapacity: any;
    buffer: any;
    shortView: any;
    wordView: any;
    dwordLength: any;
    constructor(byteSize: any);
    clear(): void;
    getByteLength(): number;
    getByteCapacity(): any;
    allocate(wordSize: any): any;
    getUsedBufferAsShort(): any;
    getUsedBufferAsWord(): any;
}
