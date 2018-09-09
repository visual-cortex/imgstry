/**
 * Binds modules to a property.
 *
 * @export
 * @param {(...Record<string, Function | Object>[])} utilities
 * @returns
 * @ignore
 */
export function BindUtility(...utilities: Record<string, Function | Object>[]) {
  return function (target: any, propertyKey: string) {
    const utility: Record<string, Function | Object> = {};

    utilities.forEach(util => {
      Object.keys(util)
        .forEach((key: string) => {
          utility[key] = util[key];
        });
    });

    target[propertyKey] = utility;
  };
}
