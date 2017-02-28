window.namespace = name => {
  let parent = window,
      children = name.split('.')

  for (child of children) {
    parent = parent[child] = parent[child] || {}
  }
}
