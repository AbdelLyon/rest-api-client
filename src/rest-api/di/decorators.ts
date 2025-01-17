// decorators/index.ts
export function Injectable(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata("injectable", true, target);
  };
}

export function Inject(token: symbol): ParameterDecorator {
  return (target, _, parameterIndex) => {
    Reflect.defineMetadata(
      "injection",
      token,
      target,
      `param:${parameterIndex}`,
    );
  };
}
