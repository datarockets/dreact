const fs = require('fs')
const path = require('path')

const findUp = require('find-up')
const { Minimatch } = require('minimatch')

function getRelatedTestFiles(filepath) {
  const dir = path.dirname(filepath)
  const name = path.basename(filepath)
  const localTestPath = path.format({
    dir,
    base: name.replace(/\.(js.*)$/, '.test.$1'),
  })

  const testFiles = []

  if (fs.existsSync(localTestPath)) {
    testFiles.push(localTestPath)
  } else {
    const testDirPath = findUp.sync(
      directory => {
        if (fs.existsSync(path.resolve(directory, '__tests__'))) {
          return directory
        }

        return findUp.stop
      },
      {
        cwd: dir,
        type: 'directory',
      },
    )

    if (testDirPath) {
      const relativeTestFilepath = filepath
        .replace(testDirPath, '')
        .replace(/^\//, '')
      const externalTestPath = path.resolve(
        testDirPath,
        '__tests__',
        relativeTestFilepath,
      )

      if (fs.existsSync(externalTestPath)) {
        testFiles.push(externalTestPath)
      }
    }
  }

  return testFiles
}

module.exports = {
  create(context) {
    const options = {
      include: '**/src/{pages,containers,components,forms,lib}/**',
      ignore: '**/{atoms.js,book.js,assets/*.js}',
      ...context.options[0],
    }

    const filename = context.getFilename()

    const isIncluded = new Minimatch(options.include)
    const isIgnored = new Minimatch(
      `{**/*.test.js,**/__tests__/**/*.js,${options.ignore}}`,
    )

    return {
      'Program:exit': function programExit(node) {
        if (isIncluded.match(filename) && !isIgnored.match(filename)) {
          const relatedTestFiles = getRelatedTestFiles(filename)

          if (relatedTestFiles.length === 0) {
            context.report({
              node,
              message: 'No related test file found',
            })
          }
        }
      },
    }
  },
}
