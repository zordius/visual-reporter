visual-reporter
===============

Generate Visual Changes Report, here is a life DEMO:

<a href="https://zordius.github.io/visual-reporter/"><img src="example1.jpg" /></a>

Features:
 * One command line tool to generate visual report as static HTML.
 * View visual difference as overlap changes or different images.
 * Options to customize the report.
 * Grouping images by seperator in file names.

<a href="https://zordius.github.io/visual-reporter/"><img src="diff.gif" /></a>

Usage
-----

```sh
$ npm install visual-reporter -g
$ visual-reporter --help

Usage: visual-reporter [options] [command]

Options:
  -V, --version               output the version number
  -b --baseline <dir>         baseline directory, default is "."
  -c --compare <dir>          compare directory, default is "./compare"
  -r --report <dir>           report directory, default is "./report"
  -s --seperator <match>      group seperator, default is "."
  -k --keepUnchanged          keep unchanged diff image, default is false
  -g --groups <g1,g2,g3,...>  group names, default is "groups"
  -t --threshold <0...1>      matching threshold, default is 0.1
  -i --includeAA              do not detecting anti-aliased pixels, default is false
  -a --alpha <0...1>          alpha of unchanged pixels, default is 0.1
  -h, --help                  output usage information

Commands:
  generate|gen                Generate visual report
```

Usecases
--------

* Put your old visual files into a directory as `baseline`.
* Run your visual automation testing.
* New generated visual files are placed in another directory as `compare`.
* Generate your visual report:
```
visual-reporter gen --baseline path/to/baseline --compare path/to/compare
```
