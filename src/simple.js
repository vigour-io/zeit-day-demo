import Hub from 'hub.js'
const hub = window.hub = Hub()

hub.subscribe({
  photos: {
    $any: true
  }
}, (data, type, subs, tree) => {
  if (type === 'new') {
    const div = document.createElement('div')
    const img = document.createElement('img')
    const title = document.createElement('h1')
    const subtitle = document.createElement('input')

    img.src = data.get('src', '').compute()
    title.innerHTML = data.get('title', '').compute()
    subtitle.value = data.get('subtitle', 'nature!').compute()

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

    img.src = data.src.compute()
    title.innerHTML = data.title.compute()
    subtitle.value = data.subtitle.compute()
  } else if (type === 'remove') {
    tree.node.parentNode.removeChild(tree.node)
    delete tree.node
  }
})

hub.connect(process.env.ZEIT_DEMO_DAY_HUB || 'ws://localhost:3030')