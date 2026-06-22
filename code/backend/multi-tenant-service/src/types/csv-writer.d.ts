// Ambient declaration for csv-writer.
//
// DataIsolationService imports "csv-writer" but it is not listed in
// package.json dependencies, so the build cannot resolve it. This unblocks
// the build; the correct fix is to add "csv-writer" to dependencies.
// See FIXES.md.
declare module "csv-writer" {
  export function createObjectCsvWriter(...args: any[]): any;
  export function createArrayCsvWriter(...args: any[]): any;
  const _default: any;
  export default _default;
}
