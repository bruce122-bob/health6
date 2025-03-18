// 补充缺失的全局类型定义
interface ArrayConstructor {
    new(length?: number): any[];
    new<T>(length: number): T[];
    new<T>(...items: T[]): T[];
    (length?: number): any[];
    <T>(length: number): T[];
    <T>(...items: T[]): T[];
    isArray(arg: any): arg is any[];
    readonly prototype: any[];
}

declare var ArrayBuffer: {
    prototype: ArrayBuffer;
    new(byteLength: number): ArrayBuffer;
    isView(arg: any): arg is ArrayBufferView;
};

declare var Float32Array: {
    prototype: Float32Array;
    new(length: number): Float32Array;
    new(array: ArrayLike<number> | ArrayBufferLike): Float32Array;
    new(buffer: ArrayBufferLike, byteOffset?: number, length?: number): Float32Array;
};

declare var Uint8Array: {
    prototype: Uint8Array;
    new(length: number): Uint8Array;
    new(array: ArrayLike<number> | ArrayBufferLike): Uint8Array;
    new(buffer: ArrayBufferLike, byteOffset?: number, length?: number): Uint8Array;
};

interface Record<K extends keyof any, T> {
    [P in K]: T;
}

interface ReadonlyArray<T> {
    readonly length: number;
    readonly [n: number]: T;
}

interface Promise<T> {
    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): Promise<TResult1 | TResult2>;
    catch<TResult = never>(
        onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): Promise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

interface PromiseLike<T> {
    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): PromiseLike<TResult1 | TResult2>;
}

interface Error {
    name: string;
    message: string;
    stack?: string;
} 