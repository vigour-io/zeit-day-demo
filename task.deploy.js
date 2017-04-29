exports.inject = [
  require('task/packages/task-deploy-services'),
  require('task/packages/task-build-js')
]

exports.tasks = {
  'deploy-services': {
    type: 'deploy-services'
  },
  'build-app': {
    type: 'build-js',
    after: [ 'deploy-services' ],
    options: {
      entry: 'src/index.js',
      dest: 'dist/index.js',
      env: [
        '@', 'parent', 'parent', 'parent',
        'deploy-services', 'result', 0, 'env'
      ],
      targets: [ 'inline' ]
    }
  }
}
