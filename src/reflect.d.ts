declare namespace Reflect {
  function getMetadata<T>(metadataKey: string, target: object): T;
  function defineMetadata<T>(
    metadataKey: string,
    metadataValue: T,
    target: object,
  ): void;
}
