import Hub from 'hub.js'
import fetch from 'node-fetch'

// reddit api
const fallbackImg = 'http://s6.favim.com/610/150312/beautiful-fog-forest-grunge-Favim.com-2556576.jpg'

const fetchReddit = (key, offset = 0) => fetch(
  'https://www.reddit.com/.json'
)
.then(res => res.json())
.then(json => json.data.children.map(({ data }) => ({
  [data.id + offset]: {
    src: data.thumbnail && data.thumbnail !== 'self'
      ? data.thumbnail
      : fallbackImg,
    title: data.title,
    subtitle: 'awesome'
  }
})).reduce((a, b) => Object.assign(a, b), {}))

// tumblr api
const tumblrApiKey = 'wZE0T5dBvDf7Qm1mvRNUMHoKH4IPq2aJRzde1wz0WMHyW2rwLP'

const fetchTumblr = (blog, offset = 0) => fetch(
  `http://api.tumblr.com/v2/blog/${
    blog
  }.tumblr.com/posts/?api_key=${
    tumblrApiKey
  }&offset=${
    offset
  }`
)
.then(res => res.json())
.then(json => json.response.posts.map(val => ({
  [val.id]: {
    src: val.photos && val.photos[0].alt_sizes[0].url,
    title: val.source_title || (val.tags && val.tags[0]) || 'wow',
    subtitle: (val.tags && val.tags.join(', ')) || 'amazing'
  }
})).reduce((a, b) => Object.assign(a, b), {}))

const hub = Hub({
  photos: function * () {
    var i = 0
    while (i < 100) {
      yield fetchTumblr('forest-nation', i * 20)
      i++
    }
  }
})

hub.listen(3030)

hub.on('error', err => console.log(err))
