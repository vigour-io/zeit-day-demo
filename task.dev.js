exports.inject = [
  require('task/packages/task-build-js'),
  require('task/packages/task-child-process'),
  require('task/packages/task-livereload')
]

exports.tasks = {
  'build-app': {
    type: 'build-js',
    options: {
      entry: 'src/context.js',
      dest: 'dist/index.js',
      raw: true,
      targets: [ 'inline' ]
    },
    done: {
      on (val, stamp, done) {
        done.root().set({
          tasks: {
            reload: { done: true }
          }
        }, stamp)
      }
    }
  },
  'serve-app': {
    type: 'child-process',
    options: {
      cmd: 'node server.js'
    }
  }
}
