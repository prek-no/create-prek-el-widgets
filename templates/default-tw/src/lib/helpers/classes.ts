import classNames from 'classnames'

export { classNames }

export function variationName (name: string, value: string | number) {
    const valuePortion =
        typeof value === 'number'
            ? String(value)
            : `${value[0].toUpperCase()}${value.substring(1)}`

    return `${name[0].toUpperCase()}${name.substring(1)}--${valuePortion}`
}
