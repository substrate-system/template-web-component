import { createDebug } from '@bicycle-codes/debug'
const debug = createDebug()

// for docuement.querySelector
declare global {
    interface HTMLElementTagNameMap {
        '{{component-name}}': Example
    }
}

export class Example extends HTMLElement {
    constructor () {
        super()

        this.innerHTML = `<div>
            <p>example</p>
            <ul>
                ${Array.from(this.children).filter(Boolean).map(node => {
                    return `<li>${node.outerHTML}</li>`
                }).join('')}
            </ul>
        </div>`
    }

    // Define the attributes to observe
    // need this for `attributeChangedCallback`
    static observedAttributes = ['exmaple']

    /**
     * Handle [example] attribute changes
     * @see {@link https://gomakethings.com/how-to-detect-when-attributes-change-on-a-web-component/#organizing-your-code Go Make Things article}
     *
     * @param  {string} oldValue The old attribute value
     * @param  {string} newValue The new attribute value
     */
    handleChange_example (oldValue:string, newValue:string) {
        debug('handling example change', oldValue, newValue)

        if (newValue === null) {
            // [example] was removed
        } else {
            // set [example] attribute
        }
    }

    /**
     * Runs when the value of an attribute is changed on the component
     * @param  {string} name     The attribute name
     * @param  {string} oldValue The old attribute value
     * @param  {string} newValue The new attribute value
     */
    attributeChangedCallback (name:string, oldValue:string, newValue:string) {
        debug('an attribute changed', name)
        const handler = this[`handleChange_${name}`];
        (handler && handler(oldValue, newValue))
    }

    disconnectedCallback () {
        debug('disconnected')
    }

    connectedCallback () {
        debug('connected')

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    debug('Node added: ', mutation.addedNodes)
                }
            })
        })

        observer.observe(this, { childList: true })
    }
}

if ('customElements' in window) {
    customElements.define('{{component-name}}', Example)
}
