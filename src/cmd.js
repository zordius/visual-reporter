import visualReporter from './'
import commander from 'commander'

commander
  .version(require('../package.json').version)
  .option('-b --baseline', 'baseline directory')
  .option('-c --current', 'current directory')
  .option('-r --report', 'report directory')

commander
  .command('generate')
  .alias('gen')
  .description('Generate visual report')

commander
  .parse(process.argv)

console.log(commander)
