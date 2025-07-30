/// <reference no-default-lib="true"/>

interface Boolean { }
interface Function { }
interface IArguments { length: number; [n: number]: any; }
interface Number { }
interface Object { }
interface RegExp { }
interface String { }
interface Date { }
interface Error {
    name: string;
    message: string;
    stack?: string;
}

interface Array<T> {
    length: number;
    [n: number]: T;
}

interface ArrayBuffer {
    readonly byteLength: number;
    slice(begin: number, end?: number): ArrayBuffer;
}

interface ArrayBufferView {
    buffer: ArrayBuffer;
    byteLength: number;
    byteOffset: number;
}

interface Float32Array {
    readonly length: number;
    [n: number]: number;
    readonly buffer: ArrayBuffer;
    readonly byteLength: number;
    readonly byteOffset: number;
    copyWithin(target: number, start: number, end?: number): this;
    every(predicate: (value: number, index: number, array: Float32Array) => unknown, thisArg?: any): boolean;
    fill(value: number, start?: number, end?: number): this;
    filter(predicate: (value: number, index: number, array: Float32Array) => any, thisArg?: any): Float32Array;
    find(predicate: (value: number, index: number, obj: Float32Array) => boolean, thisArg?: any): number | undefined;
    findIndex(predicate: (value: number, index: number, obj: Float32Array) => boolean, thisArg?: any): number;
    forEach(callbackfn: (value: number, index: number, array: Float32Array) => void, thisArg?: any): void;
    indexOf(searchElement: number, fromIndex?: number): number;
    join(separator?: string): string;
    lastIndexOf(searchElement: number, fromIndex?: number): number;
    readonly length: number;
    map(callbackfn: (value: number, index: number, array: Float32Array) => number, thisArg?: any): Float32Array;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: Float32Array) => number): number;
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: Float32Array) => U, initialValue: U): U;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: Float32Array) => number): number;
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: Float32Array) => U, initialValue: U): U;
    reverse(): Float32Array;
    set(array: ArrayLike<number>, offset?: number): void;
    slice(start?: number, end?: number): Float32Array;
    some(predicate: (value: number, index: number, array: Float32Array) => unknown, thisArg?: any): boolean;
    sort(compareFn?: (a: number, b: number) => number): this;
    subarray(begin?: number, end?: number): Float32Array;
    toString(): string;
    valueOf(): Float32Array;
}

interface Uint8Array {
    readonly length: number;
    [n: number]: number;
    readonly buffer: ArrayBuffer;
    readonly byteLength: number;
    readonly byteOffset: number;
    copyWithin(target: number, start: number, end?: number): this;
    every(predicate: (value: number, index: number, array: Uint8Array) => unknown, thisArg?: any): boolean;
    fill(value: number, start?: number, end?: number): this;
    filter(predicate: (value: number, index: number, array: Uint8Array) => any, thisArg?: any): Uint8Array;
    find(predicate: (value: number, index: number, obj: Uint8Array) => boolean, thisArg?: any): number | undefined;
    findIndex(predicate: (value: number, index: number, obj: Uint8Array) => boolean, thisArg?: any): number;
    forEach(callbackfn: (value: number, index: number, array: Uint8Array) => void, thisArg?: any): void;
    indexOf(searchElement: number, fromIndex?: number): number;
    join(separator?: string): string;
    lastIndexOf(searchElement: number, fromIndex?: number): number;
    readonly length: number;
    map(callbackfn: (value: number, index: number, array: Uint8Array) => number, thisArg?: any): Uint8Array;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: Uint8Array) => number): number;
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: Uint8Array) => U, initialValue: U): U;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: Uint8Array) => number): number;
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: Uint8Array) => U, initialValue: U): U;
    reverse(): Uint8Array;
    set(array: ArrayLike<number>, offset?: number): void;
    slice(start?: number, end?: number): Uint8Array;
    some(predicate: (value: number, index: number, array: Uint8Array) => unknown, thisArg?: any): boolean;
    sort(compareFn?: (a: number, b: number) => number): this;
    subarray(begin?: number, end?: number): Uint8Array;
    toString(): string;
    valueOf(): Uint8Array;
}

interface Record<K extends keyof any, T> {
    [P in K]: T;
}

interface ReadonlyArray<T> {
    readonly length: number;
    readonly [n: number]: T;
    concat(...items: ConcatArray<T>[]): T[];
    concat(...items: (T | ConcatArray<T>)[]): T[];
    includes(searchElement: T, fromIndex?: number): boolean;
    indexOf(searchElement: T, fromIndex?: number): number;
    join(separator?: string): string;
    lastIndexOf(searchElement: T, fromIndex?: number): number;
    slice(start?: number, end?: number): T[];
    toString(): string;
    valueOf(): T[];
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

interface ConcatArray<T> {
    readonly length: number;
    readonly [n: number]: T;
    join(separator?: string): string;
    slice(start?: number, end?: number): T[];
}

declare global {
    const Boolean: BooleanConstructor;
    const Function: FunctionConstructor;
    const Number: NumberConstructor;
    const Object: ObjectConstructor;
    const RegExp: RegExpConstructor;
    const String: StringConstructor;
    const Date: DateConstructor;
    const Promise: PromiseConstructor;
    const Error: ErrorConstructor;
    
    interface Window {
        ArrayBuffer: typeof ArrayBuffer;
        Float32Array: typeof Float32Array;
        Uint8Array: typeof Uint8Array;
    }
}

interface BooleanConstructor {
    new(value?: any): Boolean;
    (value?: any): boolean;
    readonly prototype: Boolean;
}

interface FunctionConstructor {
    new(...args: string[]): Function;
    (...args: string[]): Function;
    readonly prototype: Function;
}

interface NumberConstructor {
    new(value?: any): Number;
    (value?: any): number;
    readonly prototype: Number;
}

interface ObjectConstructor {
    new(value?: any): Object;
    (): any;
    readonly prototype: Object;
}

interface RegExpConstructor {
    new(pattern: RegExp | string): RegExp;
    new(pattern: string, flags?: string): RegExp;
    (pattern: RegExp | string): RegExp;
    (pattern: string, flags?: string): RegExp;
    readonly prototype: RegExp;
}

interface DateConstructor {
    new(): Date;
    new(value: number | string): Date;
    new(year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): Date;
    (): string;
    readonly prototype: Date;
    parse(s: string): number;
    UTC(year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): number;
    now(): number;
}

interface PromiseConstructor {
    readonly prototype: Promise<any>;
    new <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;
    all<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }>;
    race<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;
    reject<T = never>(reason?: any): Promise<T>;
    resolve(): Promise<void>;
    resolve<T>(value: T | PromiseLike<T>): Promise<T>;
}

interface ErrorConstructor {
    new(message?: string): Error;
    (message?: string): Error;
    readonly prototype: Error;
} 