export default class Svg {
  static frame(width, height) {
    const placeholder = document.getElementById('placeholder')
    if (placeholder) {
      placeholder.style.display = 'none'
    }
    let container = document.getElementById('canvas-container')
    if (!container) {
      container = document.createElement('div')
      container.setAttribute('id', 'canvas-container')
      document.body.appendChild(container)
    } else {
      container.innerHTML = ''
    }
    this.CANVAS_CONTAINER = container
    const scene = SVG().size(width, height)
    this.draw = SVG().size(width, height).addTo(container)
    return scene
  }

  static line(x1, y1, x2, y2) {
    return this.draw.line(x1, y1, x2, y2)
  }
  static rectangle(x, y) {
    return this.draw.rect(x, y)
  }
  static stroke(shape, settings = new Map()) {
    shape.stroke(Object.fromEntries(settings))
    return shape
  }
  static move(shape, x, y) {
    shape.move(x, y)
    return shape
  }
  static add_to(shape, container) {
    shape.addTo(container)
    return shape
  }
  // rectangle: (x, y, w, h) => ({ coords: [x, y, w, h], type: 'rectangle' }),
  // circle: (x, y, r) => ({ coords: [x, y, r], type: 'circle' }),
  // ellipse: (x, y, w, h) => ({ coords: [x, y, w, h], type: 'ellipse' }),
  // polygon: (vertecies) => ({ coords: [vertecies.items], type: 'polygon' }),
  // text: (text = '') => ({ content: text }),
  // path: (path) => ({ coords: [path], type: 'path' }),
  // rect: (w, h) => ({ coords: [0, 0, w, h ?? w], type: 'rectangle' }),
  // circ: (r) => ({ coords: [0, 0, r], type: 'circle' }),
  // elps: (w, h) => ({ coords: [0, 0, w, h ?? w], type: 'ellipse' }),
  // curve: (x1, y1, x2, y2, x3, y3) =>
  //   `M 0,0 C ${x1},${y1} ${x2},${y2} ${x3},${y3}`,
  // cubic_curve: (x0, y0, x1, y1, x2, y2, x3, y3) =>
  //   `M ${x0},${y0} C ${x1},${y1} ${x2},${y2} ${x3},${y3}`,
  // fill: (shape, color) => {
  //   shape.fill = color
  //   return shape
  // },
  // stroke: (shape, color) => {
  //   shape.stroke = color
  //   return shape
  // },
  // move: (shape, x, y) => {
  //   shape.move(x, y)
  //   return shape
  // },
  // dmove: (shape, x, y) => {
  //   shape.dmove(x, y)
  //   return shape
  // },
  // dx: (shape, x) => {
  //   shape.dx(x)
  //   return shape
  // },
  // dy: (shape, y) => {
  //   shape.dy(y)
  //   return shape
  // },
  // x: (shape, x) => {
  //   return shape.x(x)
  // },
  // y: (shape, y) => {
  //   return shape.y(y)
  // },
  // width: (shape, w) => {
  //   return shape.width(w)
  // },
  // heigth: (shape, h) => {
  //   return shape.height(h)
  // },
  // size: (shape, w, h) => {
  //   shape.size(w, h)
  //   return shape
  // },
  // scale: (shape, s) => {
  //   shape.scale(s)
  //   return shape
  // },
  // rotate: (shape, a) => {
  //   shape.rotate(a)
  //   return shape
  // },
  // opacity: (shape, o) => {
  //   shape.opacity(o)
  //   return shape
  // },
  // cx: (shape, x) => {
  //   return shape.cx(x)
  // },
  // cy: (shape, y) => {
  //   return shape.cy(y)
  // },
  // radius: (shape, r) => {
  //   return shape.raidus(r)
  // },
  // center: (shape, x, y) => {
  //   shape.center(x, y)
  //   return shape
  // },
  // group: () => {
  //   return LIBRARY.SKETCH.svg_canvas.group()
  // },
  // insert: (group, shapes) => {
  //   shapes.forEach((s) => group.add(s))
  //   return group
  // },
  // add: (group, shape) => {
  //   group.add(shape)
  //   return group
  // },
  // add_to: (shape, group) => {
  //   shape.addTo(group)
  //   return shape
  // },
  // write: ({ content, fill }) => {
  //   const text = LIBRARY.SKETCH.svg_canvas.plain(content)
  //   text.fill(fill)
  //   text.addTo(LIBRARY.SKETCH.svg_canvas)
  //   return text
  // },
  // attribute: (shape, settings = new Map()) => {
  //   shape.attr(Object.fromEntries(settings))
  //   return shape
  // },
  // animate: (shape, settings = new Map()) =>
  //   shape.animate(Object.fromEntries(settings)),
  // ease: (runner, cmd) => runner.ease(cmd),
  // beziere: (runner, x1, y1, x2, y2) => runner.beziere(x1, y1, x2, y2),
}
