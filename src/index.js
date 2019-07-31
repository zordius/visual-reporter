import pixelmatch from 'pixelmatch'
import fs from 'fs'
import path from 'path'
import { PNG } from 'pngjs'

class visualReporter {
  static defaultCfg = {
  }

  constructor (cfg) {
    this.cfg = {...this.defaultCfg, ...cfg}
  }

  files (dir) {
    return fs.readdirSync(dir).filter(F => F.match(/\.png$/)).map(F => path.join(dir, F))
  }

  generateReport () {
    this.baselineFiles = this.files(this.cfg.baseline)
    this.compareFiles = this.files(this.cfg.compare)
    console.log(this.compareFiles)
  }
}

export default visualReporter
