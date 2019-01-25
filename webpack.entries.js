module.exports = ({
  isDeclaration,
  src
}) => ({
  'imgstry.browser': `${src}/platform/browser/imgstry/index${isDeclaration ? '.d.ts' : '.ts'}`,
  'imgstry.spline': `${src}/platform/browser/spline/index${isDeclaration ? '.d.ts' : '.ts'}`,
  'imgstry.pixel': `${src}/pixel/index${isDeclaration ? '.d.ts' : '.ts'}`,
  'imgstry.kernel': `${src}/kernel/index${isDeclaration ? '.d.ts' : '.ts'}`,
  'imgstry': `${src}/index${isDeclaration ? '.d.ts' : '.ts'}`,
})
