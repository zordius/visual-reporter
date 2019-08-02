#!/usr/bin/env node
import VisualReporter from './'
import commander from 'commander'

commander
  .version(require('../package.json').version)
  .option('-b --baseline <dir>', 'baseline directory, default is "."')
  .option('-c --compare <dir>', 'compare directory, default is "./compare"')
  .option('-r --report <dir>', 'report directory, default is "./report"')
  .option('-s --seperator <match>', 'group seperator, default is "."')
  .option('-w --writeInfo', 'generate a brief infomation file, default is false')
  .option('-k --keepUnchanged', 'keep unchanged diff image, default is false')
  .option('-g --groups <g1,g2,g3,...>', 'group names, default is "groups"')
  .option('-t --threshold <0...1>', 'matching threshold, default is 0.1')
  .option('-i --includeAA', 'do not detecting anti-aliased pixels, default is false')
  .option('-a --alpha <0...1>', 'alpha of unchanged pixels, default is 0.1')

commander
  .command('generate')
  .alias('gen')
  .description('Generate visual report')
  .action(opts => {
    const VR = new VisualReporter({
      baseline: commander.baseline || process.cwd(),
      compare: commander.compare || process.cwd() + '/compare',
      report: commander.report || process.cwd() + '/report',
      seperator: commander.seperator || '.',
      keepUnchanged: commander.keepUnchanged,
      groups: commander.groups?.split(',') || [],
      threshold: commander.threshold || 0.1,
      alpha: commander.alpha || 0.1,
      writeInfo: commander.writeInfo,
      includeAA: commander.includeAA
    })
    VR.generateReport()
  })

commander.parse(process.argv)
