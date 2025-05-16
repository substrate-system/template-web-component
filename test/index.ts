import { test } from '@substrate-system/tapzero'
import { waitFor } from '@substrate-system/dom'
import '../src/index.js'

test('example test', async t => {
    document.body.innerHTML += `
        <{{component-name}} class="test">
        </{{component-name}}>
    `

    const el = await waitFor('{{component-name}}')

    t.ok(el, 'should find an element')
})
