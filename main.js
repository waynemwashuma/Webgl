import { Renderer } from "./renderer.js"
import {
  rotatingCube
} from "./examples/index.js"
const canvas = document.getElementById("can")
const renderer = new Renderer(canvas)
const demos = {
  "rotating cube": rotatingCube,
}
renderer.setViewport(innerWidth, innerHeight)

init(demos)
setupOpts(demos)
render()

function render(dt) {
  renderer.update()
  requestAnimationFrame(render)
}

function setupOpts(demos) {
  const container = document.body.appendChild(document.createElement("div"))
  const opts = container.appendChild(document.createElement("select"))

  container.style.position = "absolute"
  canvas.before(container)

  for (let name in demos) {
    const opt = document.createElement("option")
    opt.innerText = name
    opts.append(opt)
  }
  opts.onchange = e => {
    localStorage.setItem("play", e.target.value)
    demos[e.target.value](renderer)
  }
}

function init(demos) {
  let name = localStorage.getItem("play")
  if (!name)
    name = Object.keys(demos)[0]
  if (!name) return
  demos[name](renderer)
}