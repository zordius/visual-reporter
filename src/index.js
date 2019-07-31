import pixelmatch from 'pixelmatch'
import fs from 'fs'
import path from 'path'
import { PNG } from 'pngjs'

class visualReporter {
  static defaultCfg = {
  }

  constructor (cfg) {
    this.cfg = {...this.defaultCfg, ...cfg}
    this.files = {}
  }

  getFiles (dir) {
    return fs.readdirSync(dir).filter(F => F.match(/\.png$/))
  }

  getAdded (list1, list2) {
    return list2.filter(F => !list1.includes(F))
  }

  printInfo () {
    console.log(`
baseline files: ${this.files.baseline.length}
compare files : ${this.files.compare.length}
added files   : ${this.files.add.length}
removed files : ${this.files.remove.length}
`)
  }

  generateReport () {
    this.files.baseline = this.getFiles(this.cfg.baseline)
    this.files.compare = this.getFiles(this.cfg.compare)
    this.files.add = this.getAdded(this.files.baseline, this.files.compare)
    this.files.remove = this.getAdded(this.files.compare, this.files.baseline)
    this.printInfo()
  }
}

export default visualReporter
