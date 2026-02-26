import '../src/index.css'
import '../src/index.js'

if (import.meta.env.DEV || import.meta.env.MODE !== 'production') {
    localStorage.setItem('DEBUG', '{{component-name}}')
} else {
    localStorage.removeItem('DEBUG')
}

document.body.innerHTML += `
    <{{component-name}}></{{component-name}}>
`
