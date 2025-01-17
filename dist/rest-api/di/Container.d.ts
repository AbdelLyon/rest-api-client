type Constructor<T> = new (...args: Array<any>) => T;
export interface BindingBuilder<T> {
    to: (target: Constructor<T>) => void;
    toInstance: (instance: T) => void;
}
export declare class Container {
    private static instances;
    private static bindings;
    static reset(): void;
    static bind<T>(token: symbol): BindingBuilder<T>;
    static resolve<T>(target: Constructor<T> | symbol): T;
    private static createInstance;
}
export {};
