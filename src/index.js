import pixelmatch from 'pixelmatch'
import fs from 'fs'
import path from 'path'
import { PNG } from 'pngjs'
import { Bar, Presets } from 'cli-progress'

const matchPng = /\.png$/i

class visualReporter {
  constructor(cfg) {
    this.cfg = { ...cfg }
  }

  getDescription(dir, F) {
    const name = path.resolve(dir, F.replace(matchPng, '.txt'))
    return fs.existsSync(name) ? fs.readFileSync(name, 'utf8') : undefined
  }

  getFiles(dir) {
    return fs
      .readdirSync(dir)
      .filter(F => F.match(matchPng))
      .map(F => ({
        file: F,
        description: this.getDescription(dir, F)
      }))
  }

  getAdded(list1, list2) {
    const files = list1.map(F => F.file)
    return list2.filter(F => !files.includes(F.file))
  }

  getIntersection(list1, list2) {
    const files = list1.map(F => F.file)
    return list2.filter(F => files.includes(F.file))
  }

  getFilename(dir, file) {
    return path.resolve(dir, file)
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

  generateDiff(F) {
    const img1 = this.readPng(this.cfg.baseline, F.file)
    const img2 = this.readPng(this.cfg.compare, F.file)
    const { width, height } = img1
    const diff = width * height - img2.width * img2.height
    const R = {
      ...F,
      sizeMatched: false,
      baseline: {
        width,
        height
      },
      compare: {
        width: img2.width,
        height: img2.height
      },
      diff
    }

    if (diff) {
      return R
    }

    R.sizeMatched = true
    const diffImg = new PNG({ width, height })

    R.diff = pixelmatch(img1.data, img2.data, diffImg.data, width, height, {
      threshold: this.cfg.threshold,
      includeAA: this.cfg.includeAA,
      alpha: this.cfg.alpha
    })

    if (R.diff > 0 || this.cfg.keepUnchanged) {
      this.writePng(this.cfg.report, F.file, diffImg)
    }
    return R
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
    this.files.intersection = this.getIntersection(this.files.baseline, this.files.compare)
  }

  analyzeGroup(name) {
    this.groups[name] = []
    this.files[name].forEach(F =>
      F.file
        .replace(matchPng, '')
        .split(this.cfg.seperator)
        .forEach((value, I) => {
          if (!this.groups[name][I]) {
            this.groups[name][I] = {}
          }
          if (!this.groups[name][I][value]) {
            this.groups[name][I][value] = 0
          }
          this.groups[name][I][value]++
        })
    )
    if (this.groups[name].length === 1) {
      this.groups[name] = []
    }
  }

  analyzeGroups() {
    this.groups = {}
    this.analyzeGroup('add')
    this.analyzeGroup('remove')
    this.analyzeGroup('unchanged')
    this.analyzeGroup('pchanged')
    this.analyzeGroup('schanged')
  }

  generateDiffImages() {
    const bar = new Bar({}, Presets.shades_classic)
    bar.start(this.files.intersection.length, 0)
    this.diff = this.files.intersection.map((F, I) => {
      const R = this.generateDiff(F, I)
      bar.update(I + 1)
      return R
    })
    this.files.unchanged = this.diff.filter(R => R.diff === 0)
    const changed = this.diff.filter(R => R.diff)
    this.files.schanged = changed.filter(R => !R.sizeMatched)
    this.files.pchanged = changed.filter(R => R.sizeMatched)
    bar.stop()
  }

  saveMeta() {
    fs.writeFileSync(
      this.getFilename(this.cfg.report, 'index.js'),
      'R = ' +
        JSON.stringify(
          {
            cfg: {
              seperator: this.cfg.seperator,
              customStyle: this.cfg.customStyle,
              groups: this.cfg.groups || []
            },
            path: {
              baseline: path.relative(this.cfg.report, this.cfg.baseline) + '/',
              compare: path.relative(this.cfg.report, this.cfg.compare) + '/'
            },
            ...this.files,
            groups: this.groups,
            diff: this.diff
          },
          undefined,
          ' '
        )
    )
  }

  copyFile(name) {
    fs.writeFileSync(
      this.getFilename(this.cfg.report, name),
      fs.readFileSync(this.getFilename(__dirname, '../report/' + name))
    )
  }

  saveReport() {
    this.copyFile('index.html')
    this.copyFile('favicon.ico')
  }

  saveInfo() {
    if (!this.cfg.writeInfo) {
      return
    }
    fs.writeFileSync(
      this.getFilename(this.cfg.report, 'info.txt'),
      `baseline: ${this.files.baseline.length} , add: ${this.files.add.length} , remove: ${
        this.files.remove.length
      } , changed: ${this.files.pchanged.length + this.files.schanged.length}`
    )
  }

  exit() {
    process.exit(
      (this.files.add.length ? 1 : 0) +
        (this.files.remove.length ? 2 : 0) +
        (this.files.schanged.length ? 4 : 0) +
        (this.files.pchanged.length ? 8 : 0)
    )
  }

  generateReport() {
    this.readFiles()
    this.printInfo()
    this.generateDiffImages()
    this.analyzeGroups()
    this.saveMeta()
    this.saveReport()
    this.saveInfo()
    this.exit()
  }
}

export default visualReporter
