const { exec } = require('child_process')
var deployApp

exports.inject = [
  require('task/packages/task-deploy-services'),
  require('task/packages/task-build-js'),
  require('task/packages/task-child-process')
]

exports.tasks = {
  'deploy-services': {
    type: 'deploy-services',
    result: {
      props: {
        default: {
          on ({ env, name }, stamp, struct) {
            deployApp = Object.keys(env)
              .reduce((cmd, name) => cmd + ` -e ${name}=${env[name]}`,
                'now --forward-npm')
          }
        }
      }
    }
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
  },
  'deploy-app': {
    val: task => new Promise(resolve => {
      if (deployApp) {
        const p = exec(deployApp)
        const ondata = data => task.get('log', {}).push(data)

        p.stdout.on('data', ondata)
        p.stderr.on('data', ondata)
        p.on('close', () => resolve({ done: true }))

        deployApp = false
      }
    }),
    after: [ 'build-app' ]
  }
}
