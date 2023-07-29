const CLASS_PREFIX = 'ne-dt-'

const CLASSNAME = ''

function addPrefix(classNames) {
  const prefixedClassName = classNames
    .split(' ')
    .map((className) => CLASS_PREFIX + className)
    .join(' ')

  // eslint-disable-next-line no-console
  console.log(prefixedClassName)

  return prefixedClassName
}

addPrefix(CLASSNAME)
