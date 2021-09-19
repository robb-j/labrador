import Alpine from 'alpinejs'
import './style.css'
import persist from '@alpinejs/persist'

import { changesData } from './changes-data'
import { copyData } from './copy-data'

Alpine.plugin(persist)

document.addEventListener('alpine:init', () => {
  Alpine.data('changes', changesData)
  Alpine.data('copy', copyData)
})

Alpine.start()

Object.assign(window, { Alpine })
