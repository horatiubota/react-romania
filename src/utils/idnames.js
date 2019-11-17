import classnames from 'classnames'

const idnames = function(...args) {
    return classnames(args).replace(/\s/g, '_')
}

const d3classnames = function(...args) {
    return classnames(args.map(item => '.' + item))
}

export { idnames, d3classnames }
export default idnames