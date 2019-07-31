import pixelmatch from 'pixelmatch'
import fs from 'fs'
import { PNG } from 'pngjs'

class visualReporter {
  static defaultCfg = {
  }

  constructor (cfg) {
    this.cfg = {...this.defaultCfg, ...cfg}
  }
}

export default visualReporter
