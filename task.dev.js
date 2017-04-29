exports.inject = [
  require('task/packages/task-build-js'),
  require('task/packages/task-child-process'),
  require('task/packages/task-livereload')
]

exports.tasks = {
  'build-hub': {
    type: 'build-js',
    options: {
      entry: 'hub/index.js',
      dest: 'hub/dist/index.js',
      raw: true,
      targets: [ 'node' ]
    }
  },
  'run-hub': {
    type: 'child-process',
    after: [ 'build-hub' ],
    options: {
      cmd: 'node ./hub/dist/index.js'
    }
  },
  'build-app': {
    type: 'build-js',
    options: {
      entry: 'src/index.js',
      dest: 'dist/index.js',
      raw: true,
      targets: [ 'inline' ]
    }
  },
  'serve-app': {
    type: 'child-process',
    options: {
      cmd: 'node server.js'
    }
  }
}
