import { renderRouter } from './router'
import './style.css'

document.addEventListener("DOMContentLoaded", renderRouter)
window.addEventListener("hashchange", renderRouter)


