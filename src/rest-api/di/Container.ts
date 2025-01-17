import "reflect-metadata";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: Array<any>) => T;
type Token<T> = Constructor<T> | symbol;

export interface BindingBuilder<T> {
  to: (target: Constructor<T>) => void;
  toInstance: (instance: T) => void;
}

export class Container {
  private static instances = new Map<Token<unknown>, unknown>();
  private static bindings = new Map<Token<unknown>, Constructor<unknown>>();

  static reset(): void {
    this.instances.clear();
    this.bindings.clear();
  }

  static bind<T>(token: symbol): BindingBuilder<T> {
    return {
      to: (target: Constructor<T>) => {
        this.bindings.set(token, target);
      },
      toInstance: (instance: T) => {
        this.instances.set(token, instance);
      },
    };
  }

  static resolve<T>(target: Constructor<T> | symbol): T {
    const existingInstance = this.instances.get(target);
    if (existingInstance !== undefined) {
      return existingInstance as T;
    }

    const implementation = this.bindings.get(target) ?? target;

    if (implementation === undefined || implementation === null) {
      throw new Error(`No binding found for ${String(target)}`);
    }

    const instance = this.createInstance(implementation as Constructor<T>);
    this.instances.set(implementation, instance);
    return instance;
  }

  private static createInstance<T>(target: Constructor<T>): T {
    const tokens = Reflect.getMetadata("design:paramtypes", target) ?? [];
    const dependencies = tokens.map((token: Constructor<unknown>) =>
      this.resolve(token),
    );
    return new target(...dependencies);
  }
}
