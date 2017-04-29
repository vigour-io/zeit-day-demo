import Hub from 'hub.js'
const hub = Hub()

console.log('-simple-')

hub.subscribe({
  photos: {
    $any: true
  }
}, (photo, type, subs, tree) => {
  if (type === 'new') {
    const div = document.createElement('div')
    const img = document.createElement('img')
    const title = document.createElement('h1')
    const subtitle = document.createElement('input')

    img.src = photo.src.compute()
    title.innerHTML = photo.title.compute()
    subtitle.value = photo.subtitle.compute()

    subtitle.addEventListener('input', () => data.set({
      subtitle: subtitle.value
    }))

    div.appendChild(img)
    div.appendChild(title)
    div.appendChild(subtitle)

    document.body.appendChild(div)

    tree.node = div
  } else if (type === 'update') {
    const [ img, title, subtitle ] = tree.node.children

    img.src = photo.src.compute()
    title.innerHTML = photo.title.compute()
    subtitle.value = photo.subtitle.compute()
  } else if (type === 'remove') {
    tree.node.parentNode.removeChild(tree.node)
    delete tree.node
  }
})

hub.connect('ws://localhost:3030')
