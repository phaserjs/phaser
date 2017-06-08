export default class VertexBuffer {
    dwordLength: any;
    dwordCapacity: any;
    buffer: any;
    floatView: any;
    intView: any;
    uintView: any;
    constructor(byteSize: any);
    clear(): void;
    getByteLength(): number;
    getByteCapacity(): any;
    allocate(dwordSize: any): any;
    getUsedBufferAsFloat(): any;
    getUsedBufferAsInt(): any;
    getUsedBufferAsUint(): any;
}
