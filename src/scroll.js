import { isFavorite, addFavorite } from './icons'
import Hub from 'hub.js'

console.log('-scroll-')

const hub = Hub()

hub.subscribe({
  photos: {
    $any: {
      val: true,
      $keys: {
        val (keys, photos) {
          const client = photos.root().client
          const scrollTop = client.get('scrollTop', 0).compute()
          const innerHeight = client.get('innerHeight', 0).compute()
          const innerWidth = client.get('innerWidth', 0).compute()

          const treshold = innerWidth < 600
            ? innerWidth
            : innerWidth < 900
              ? innerWidth / 4
              : innerWidth / 9

          const minAmount = Math.ceil(innerHeight / treshold)
          const scrolledAmount = Math.ceil(scrollTop / treshold)
          return keys.slice(0, minAmount + scrolledAmount + 2)
        },
        root: {
          client: {
            scrollTop: true,
            innerHeight: true,
            innerWidth: true
          }
        }
      }
    }
  }
}, (data, type, subs, tree) => {
  if (data.parent().key === 'photos') {
    if (type === 'new') {
      const div = document.createElement('div')
      const img = document.createElement('img')
      const title = document.createElement('h1')
      const subtitle = document.createElement('input')
      const favorite = document.createElement('span')

      img.src = data.get('src', '').compute()
      title.innerHTML = data.get('title', '').compute()
      subtitle.value = data.get('subtitle', '').compute()
      favorite.innerHTML = data.get('favorite', false).compute()
        ? isFavorite
        : addFavorite

      subtitle.addEventListener('input', () => data.set({
        subtitle: subtitle.value
      }))

      div.addEventListener('click', () => data.set({
        favorite: !data.get('favorite', false).compute()
      }))

      div.appendChild(img)
      div.appendChild(title)
      div.appendChild(favorite)
      div.appendChild(subtitle)

      document.body.appendChild(div)

      tree.node = div
    } else if (type === 'update') {
      const [ img, title, favorite, subtitle ] = tree.node.children

      img.src = data.src.compute()
      img.src = data.src.compute()
      title.innerHTML = data.title.compute()
      subtitle.value = data.subtitle.compute()
      favorite.innerHTML = data.get('favorite', false).compute()
        ? isFavorite
        : addFavorite
    } else if (type === 'remove') {
      tree.node.parentNode.removeChild(tree.node)
      delete tree.node
    }
  }
})

hub.connect('ws://localhost:3030')

// add listeners and set initial width and height
window.addEventListener('scroll', () => hub.client.set({
  scrollTop: document.body.scrollTop
}))

window.addEventListener('resize', () => hub.client.set({
  innerWidth: window.innerWidth,
  innerHeight: window.innerHeight
}))

hub.client.set({
  innerWidth: window.innerWidth,
  innerHeight: window.innerHeight
})
