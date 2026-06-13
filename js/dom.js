// Tiny DOM builders. Untrusted spreadsheet content is set via textContent and
// setAttribute (neither parses its input as HTML), so it can never inject
// script or markup the way an innerHTML string template would.

const SVG_NS = 'http://www.w3.org/2000/svg'

function build(node, attrs, children) {
    for (const [name, value] of Object.entries(attrs)) {
        if (value == null || value === false) continue
        node.setAttribute(name, value === true ? '' : value)
    }
    for (const child of [].concat(children)) {
        if (child == null || child === false) continue
        node.append(child) // strings become text nodes; nodes are appended as-is
    }
    return node
}

// Build an HTML element: el('a', { href, class: 'wiki' }, 'Read more')
export function el(tag, attrs = {}, children = []) {
    return build(document.createElement(tag), attrs, children)
}

// Build an SVG element (uses the SVG namespace so it renders correctly).
export function svg(tag, attrs = {}, children = []) {
    return build(document.createElementNS(SVG_NS, tag), attrs, children)
}

// Parse a trusted (author-written, never user data) SVG string into a node,
// e.g. the static Feather icons.
export function svgFromMarkup(markup) {
    const tpl = document.createElement('template')
    tpl.innerHTML = markup
    return tpl.content.firstElementChild
}

// Return url only if it uses a safe scheme, otherwise null. Blocks javascript:
// and data: URLs that would otherwise execute when a link is clicked.
export function safeUrl(url) {
    try {
        const { protocol } = new URL(url, window.location.href)
        return protocol === 'http:' || protocol === 'https:' ? url : null
    } catch {
        return null
    }
}
