const path = require('path')
const fs = require('fs')
const exec = require('child_process').execSync

const _ = require('lodash')
const dotenv = require('dotenv')

module.exports = () => {
  if (process.env.CI === 'true') {
    process.exit(0)
  }

  const filepath = relativePath => path.resolve(process.cwd(), relativePath)

  process.chdir(path.resolve(process.cwd()))

  const TARGET_FILE = '.env.local'
  const SAMPLE_FILE = '.env.sample'

  /* eslint-disable no-console */
  const printHeader = text => console.log(`\x1b[1m\x1b[33m${text}\x1b[0m`)
  const printStatusInserted = () =>
    console.log('\x1b[1m    \x1b[42m Inserted \x1b[0m')
  const printStatusRemoved = () =>
    console.log('\x1b[1m    \x1b[41m Removed \x1b[0m')
  const printStatusSyncedLines = () =>
    console.log('\x1b[1m    \x1b[42m Synced Empty Lines \x1b[0m')
  const printName = name => console.log(`\x1b[36m  - ${name}\x1b[0m`)
  const printNL = () => process.stdout.write('\n')
  /* eslint-enable */

  if (!fs.existsSync(filepath(SAMPLE_FILE))) {
    process.exit(0)
  }

  if (fs.existsSync(filepath(TARGET_FILE))) {
    const envLocalContent = fs.readFileSync(filepath(TARGET_FILE), 'utf8')
    const envSampleContent = fs.readFileSync(filepath(SAMPLE_FILE), 'utf8')

    const varsLocal = dotenv.parse(envLocalContent)
    const varsLocalList = Object.keys(varsLocal)
    const varsSample = dotenv.parse(envSampleContent)
    const varsSampleList = Object.keys(varsSample)

    const extraLocal = _.difference(varsLocalList, varsSampleList)
    const extraSample = _.difference(varsSampleList, varsLocalList)

    let envLocalLines = envLocalContent.trim().split('\n')
    const envSampleLines = envSampleContent.trim().split('\n')

    const hasUnwantedVars = extraLocal.length > 0
    const hasDesiredVars = extraSample.length > 0
    const hasDifferentLines = envLocalLines.length !== envSampleLines.length

    if (hasUnwantedVars || hasDesiredVars || hasDifferentLines) {
      printNL()
    } else {
      process.exit(0)
    }

    printHeader('Changes in .env files')
    printNL()

    // Remove not defined variables anymore
    if (extraLocal.length > 0) {
      extraLocal.forEach(extraLocalName => {
        const excludingLineNo = envLocalLines.findIndex(item =>
          item.startsWith(`${extraLocalName}=`),
        )

        if (excludingLineNo > 0) {
          envLocalLines.splice(excludingLineNo, 1)

          printName(extraLocalName)
          printStatusRemoved()
          printNL()
        }
      })
    }

    // Extend lines to put variables to correct position
    Array(100)
      .fill('')
      .forEach(() => envLocalLines.push(''))

    // Insert variables from sample file
    if (extraSample.length > 0) {
      extraSample.forEach(extraSampleName => {
        const targetPosition = envSampleLines.findIndex(item =>
          item.startsWith(`${extraSampleName}=`),
        )
        const line = `${extraSampleName}=${varsSample[extraSampleName]}`

        envLocalLines.splice(targetPosition, 0, line)

        printName(extraSampleName)
        printStatusInserted()
        printNL()
      })
    }

    // Remove all empty lines
    envLocalLines = envLocalLines.filter(line => line !== '')

    // Sync empty lines according to sample file
    envSampleLines.forEach((content, index) => {
      if (content === '' && envLocalLines[index] !== '') {
        envLocalLines.splice(index, 0, '')
      }
    })

    printStatusSyncedLines()
    printNL()

    envLocalLines.push('')
    fs.writeFileSync(filepath(TARGET_FILE), envLocalLines.join('\n'), 'utf8')

    setTimeout(() => {
      /* It's just a delay to let people read the console */
    }, 3000)
  } else {
    exec(`cp ${SAMPLE_FILE} ${TARGET_FILE}`)
    printNL()
    printHeader(`Created ${TARGET_FILE} file`)
    printNL()
  }
}
