import pixelmatch from 'pixelmatch'
import fs from 'fs'
import path from 'path'
import { PNG } from 'pngjs'
import { Bar, Presets } from 'cli-progress'

class visualReporter {
  static defaultCfg = {}

  constructor(cfg) {
    this.cfg = { ...this.defaultCfg, ...cfg }
  }

  getFiles(dir) {
    return fs.readdirSync(dir).filter(F => F.match(/\.png$/))
  }

  getAdded(list1, list2) {
    return list2.filter(F => !list1.includes(F))
  }

  getIntersection(list1, list2) {
    return list2.filter(F => list1.includes(F))
  }

  getFilename(dir, file) {
    return path.join(dir, file)
  }

  readPng(dir, file) {
    return PNG.sync.read(fs.readFileSync(this.getFilename(dir, file)))
  }

  writePng(dir, file, png) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(this.getFilename(dir, file), PNG.sync.write(png))
  }

  generateDiff(file) {
    const img1 = this.readPng(this.cfg.baseline, file)
    const img2 = this.readPng(this.cfg.compare, file)
    const { width, height } = img1
    const diff = width * height - img2.width * img2.height

    if (diff) {
      return {
        width,
        height,
        diff
      }
    }

    const diffImg = new PNG({ width, height })

    const ret = pixelmatch(img1.data, img2.data, diffImg.data, width, height, {
      threshold: this.cfg.threshold,
      includeAA: this.cfg.includeAA
    })

    this.writePng(this.cfg.report, file, diffImg)
    return {
      file,
      baseline: {
        width,
        height
      },
      compare: {
        width: img2.width,
        height: img2.height
      },
      diff: ret
    }
  }

  printInfo() {
    console.log(`
baseline files    : ${this.files.baseline.length}
compare files     : ${this.files.compare.length}
added files       : ${this.files.add.length}
removed files     : ${this.files.remove.length}
intersection files: ${this.files.intersection.length}
`)
  }

  readFiles() {
    this.files = {}
    this.files.baseline = this.getFiles(this.cfg.baseline)
    this.files.compare = this.getFiles(this.cfg.compare)
    this.files.add = this.getAdded(this.files.baseline, this.files.compare)
    this.files.remove = this.getAdded(this.files.compare, this.files.baseline)
    this.files.intersection = this.getIntersection(this.files.compare, this.files.baseline)
  }

  generateDiff() {
    const bar = new Bar({}, Presets.shades_classic)
    bar.start(this.files.intersection.length, 0)
    this.diff = this.files.intersection.map((F, I) => {
      const R = this.generateDiff(F, I)
      bar.update(I + 1)
      return R
    })
    bar.stop()
  }

  generateHtml() {
    console.log(this.diff)
  }

  generateReport() {
    this.readFiles()
    this.printInfo()
    this.generateDiff()
    this.generateHtml()
  }
}

export default visualReporter
