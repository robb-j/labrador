import { AlpineThis } from 'alpinejs'
import dot from 'dot-prop'
import YAML from 'yaml'

// TODO: look into editing via CST

function getKeys(object: object, path: string[] = []) {
  const newKeys: string[] = []

  for (const [key, value] of Object.entries(object)) {
    if (!value) continue

    const newPath = path.concat([key])
    if (typeof value === 'object') {
      newKeys.push(...getKeys(value, newPath))
    } else {
      newKeys.push(newPath.join('.'))
    }
  }
  return newKeys
}

interface DocEdit {
  key: string
  target: unknown
  reference: unknown
}

type ChangeObject = null | Record<string, unknown>
const viewModes = ['missing', 'changed', 'all']

export function changesData(this: AlpineThis) {
  return {
    //
    // Data
    //
    state: 'setup',
    referenceFile: null as File | null,
    targetFile: null as File | null,
    reference: this.$persist<ChangeObject>(null),
    target: this.$persist<ChangeObject>(null),
    open: this.$persist({}) as Record<string, boolean | undefined>,
    changes: this.$persist({}) as Record<string, string | undefined>,
    viewMode: viewModes[0],
    edits: [] as DocEdit[],

    //
    // Accessors
    //
    get canSubmitFiles() {
      return this.referenceFile !== null && this.targetFile !== null
    },
    get isSetup() {
      return this.reference !== null && this.target !== null
    },
    get changesMessage() {
      const count = Object.keys(this.changes).length
      return count === 1 ? `1 Change made` : `${count} Changes made`
    },
    get filteredEdits() {
      return this.edits.filter((edit) => {
        switch (this.viewMode) {
          case 'changed':
            return Boolean(this.changes[edit.key])
          case 'missing':
            return !Boolean(edit.target)
          default:
            return true
        }
      })
    },
    get hasChanges() {
      return Object.keys(this.changes).length > 0
    },

    //
    // Lifecycle
    //
    init() {
      this.state = this.isSetup ? 'editing' : 'setup'
      this.edits = this.getEdits()
    },

    async startChanges(reference: File, target: File) {
      try {
        this.reference = YAML.parse(await reference.text())
        this.target = YAML.parse(await target.text())
        this.state = 'editing'
        this.edits = this.getEdits()
      } catch (error) {
        window.alert((error as Error).message)
      }
    },

    //
    // Helpers
    //
    getEdits(): DocEdit[] {
      if (!this.target || !this.reference) return []

      return getKeys(this.reference).map((key) => ({
        key: key,
        target: dot.get(this.target!, key),
        reference: dot.get(this.reference!, key),
      }))
    },
    makeEdit(key: string, event: InputEvent) {
      this.changes[key] = (event.target as HTMLTextAreaElement).value
    },
    getTargetValue(key: string) {
      if (!this.target) return null
      return dot.get(this.target, key)
    },
    getReferenceValue(key: string) {
      if (!this.reference) return null
      return dot.get(this.reference, key)
    },

    //
    // Actions
    //
    cycleViewMode() {
      const index = viewModes.indexOf(this.viewMode)
      this.viewMode = viewModes[(index + 1) % viewModes.length]
    },
    resetChanges() {
      this.targetFile = null
      this.referenceFile = null
      this.target = null
      this.reference = null
      this.open = {}
      this.changes = {}
      this.state = 'setup'

      // TODO: work out why the x-if isn't updating
      window.location.reload()
    },
    saveChanges() {
      if (!this.target) return

      for (const [key, value] of Object.entries(this.changes)) {
        dot.set(this.target, key, value)
      }

      this.downloadChanges()

      this.changes = {}
      this.edits = this.getEdits()
    },
    downloadChanges() {
      if (!this.target) return

      const yaml = YAML.stringify(this.target, {
        sortMapEntries: true,
      })
      const blob = new Blob([yaml], { type: 'text/yaml' })

      const a = document.createElement('a')
      a.download = 'output.yml'
      a.href = URL.createObjectURL(blob)
      a.click()
    },
  }
}
