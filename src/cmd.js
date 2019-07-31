#!/usr/bin/env node
import VisualReporter from './'
import commander from 'commander'

commander
  .version(require('../package.json').version)
  .option('-b --baseline <dir>', 'baseline directory, default is .')
  .option('-c --compare <dir>', 'compare directory, default is ./compare')
  .option('-r --report <dir>', 'report directory, default is ./report')
  .option('-g --group <match>', 'group seperator, default is .')

commander
  .command('generate')
  .alias('gen')
  .description('Generate visual report')
  .action(opts => {
    const VR = new VisualReporter({
      baseline: commander.baseline || process.cwd(),
      compare: commander.compare || process.cwd() + '/compare',
      report: commander.report || process.cwd() + '/report',
      group: commander.group || '.'
    })
    VR.generateReport()
  })

commander.parse(process.argv)
