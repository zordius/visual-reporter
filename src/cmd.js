#!/usr/bin/env node
import VisualReporter from './'
import commander from 'commander'

commander
  .version(require('../package.json').version)
  .option('-b --baseline <dir>', 'baseline directory, default is .')
  .option('-c --compare <dir>', 'compare directory, default is ./compare')
  .option('-r --report <dir>', 'report directory, default is ./report')
  .option('-s --seperator <match>', 'group seperator, default is .')
  .option('-k --keepunchanged', 'keep unchanged diff image, default is false')
  .option('-g --groups <g1,g2,g3...>', 'group names, default is groups')

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
      keepunchanged: commander.keepunchanged,
      groups: commander.groups?.split(',') || []
    })
    VR.generateReport()
  })

commander.parse(process.argv)
