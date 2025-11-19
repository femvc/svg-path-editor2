class rulerX {
  constructor() {
    this.props = this.props || {}
    this.paint = (conf) => {
      let scene = window.getSceneInfo()
      let unit =
        conf.scaleFactor >= 3
          ? 10
          : conf.scaleFactor <= 0.25
          ? 200
          : conf.scaleFactor <= 0.5
          ? 100
          : 50
      let e = {
        ctx: conf.ctx,
        scaleFactor: conf.scaleFactor || 1,
        rulerUnit: unit,
        rulerHeight: 24,
        rulerWidth: scene.sceneWidth,
        zeroGraduationPosition: {
          x: scene.zeroGraduationPosition.x,
          y: scene.zeroGraduationPosition.y,
        },
      }
      const {
        ctx: t,
        rulerWidth: o,
        rulerHeight: n,
        rulerUnit: r,
        scaleFactor: s,
        zeroGraduationPosition: { x: l },
      } = e
      // aa.default.applyGraduationStroke(t);
      t.lineWidth = 1
      t.strokeStyle = 'rgba(96, 96, 96, 1)'

      t.beginPath()
      t.moveTo(0, n - 0.5)
      t.lineTo(o, n - 0.5)
      const { activeArea: c } = this.props
      if (c) {
        const { left: e, width: o } = c
        // aa.default.applyActiveAreaFill(t);
        t.fillStyle = 'rgba(0, 157, 255, 0.2)'

        t.fillRect(Math.round(l + e * s), 0, Math.round(o * s), n)
      }
      this.addFullRulerLineX(
        {
          startX: cc.calcStartCoordinateValue(l, s, r),
          endX: o,
          startGraduationValue: cc.calcStartGraduationValue(l, s, r),
        },
        e,
      )
      t.stroke()
    }
  }

  addFullRulerLineX(e, t) {
    const { startX: o, endX: n, startGraduationValue: i } = e,
      { ctx: a, scaleFactor: r, rulerUnit: s } = t,
      l = 1 * s * r,
      c = Math.ceil(n / l)
    let d = o,
      h = i
    for (let e = 0; e <= c; e++) {
      this.addUnitRulerLineX(
        {
          startX: d,
          intervalCount: 10,
        },
        t,
      )
      this.addRulerLineText(a, d, h)
      d += l
      h += s
    }
  }

  addRulerLineText(e, t, o) {
    const n = o.toString(),
      i = t + 4
    // aa.default.applyFontStyle(e);
    e.fillStyle = 'rgba(96, 96, 96, 1)'
    e.font = `12px Arial`

    e.fillText(n, i, 12)
  }

  addUnitRulerLineX(e, t) {
    const { startX: o, intervalCount: n } = e,
      { ctx: ctx, rulerHeight: r, rulerUnit: s, scaleFactor: l } = t,
      c = (s / n) * l
    let d = o
    for (let e = 0; e < n; e++) {
      const t = Math.round(d) + 0.5
      ctx.moveTo(t, r)
      if (0 === e) ctx.lineTo(t, 0)
      else ctx.lineTo(t, r - aa.SHORT_GRADUATION_SIZE)
      d += c
    }
  }
}

class rulerY {
  constructor() {
    this.props = this.props || {}
    this.paint = (conf) => {
      let scene = window.getSceneInfo()
      let unit =
        conf.scaleFactor >= 3
          ? 10
          : conf.scaleFactor <= 0.25
          ? 200
          : conf.scaleFactor <= 0.5
          ? 100
          : 50
      let e = {
        ctx: conf.ctx,
        scaleFactor: conf.scaleFactor || 1,
        rulerUnit: unit,
        rulerHeight: scene.sceneHeight,
        rulerWidth: 24,
        zeroGraduationPosition: {
          x: scene.zeroGraduationPosition.x,
          y: scene.zeroGraduationPosition.y,
        },
      }
      const {
        ctx: t,
        rulerWidth: o,
        rulerHeight: n,
        rulerUnit: r,
        scaleFactor: s,
        zeroGraduationPosition: { y: l },
      } = e
      // aa.default.applyGraduationStroke(t);
      t.lineWidth = 1
      t.strokeStyle = 'rgba(96, 96, 96, 1)'

      t.beginPath()
      t.moveTo(o - 0.5, 0)
      t.lineTo(o - 0.5, n)
      const { activeArea: c } = this.props
      if (c) {
        const { top: e, height: n } = c
        // aa.default.applyActiveAreaFill(t)
        t.fillStyle = 'rgba(0, 157, 255, 0.2)'

        t.fillRect(0, Math.round(l + e * s), o, Math.round(n * s))
      }
      this.addFullRulerLine(
        {
          startY: cc.calcStartCoordinateValue(l, s, r),
          endY: n,
          startGraduationValue: cc.calcStartGraduationValue(l, s, r),
        },
        e,
      )
      t.stroke()
      t.clearRect(0, 0, aa.RULE_SIZE, aa.RULE_SIZE)
      t.strokeRect(-0.5, -0.5, aa.RULE_SIZE, aa.RULE_SIZE)
    }
  }

  addFullRulerLine(e, t) {
    const { startY: o, endY: n, startGraduationValue: i } = e,
      { ctx: a, scaleFactor: r, rulerUnit: s } = t,
      l = 1 * s * r,
      c = Math.ceil(n / l)
    let d = o,
      h = i
    for (let e = 0; e <= c; e++) {
      this.addUnitRulerLine(
        {
          startY: d,
          intervalCount: 10,
        },
        t,
      )
      this.addRulerLineText(a, d, h)
      d += l
      h += s
    }
  }

  addRulerLineText(e, t, o) {
    const n = o.toString(),
      i = t
    // aa.default.applyFontStyle(e),
    e.fillStyle = 'rgba(96, 96, 96, 1)'
    e.font = `12px Arial`
    e.save()
    e.translate(12, i)
    e.rotate(-Math.PI / 2)
    e.translate(-12, -i)
    e.fillText(n, 16, i)
    e.restore()
  }

  addUnitRulerLine(e, t) {
    const { startY: o, intervalCount: n } = e,
      { ctx: i, rulerWidth: r, rulerUnit: s, scaleFactor: l } = t,
      c = (s / n) * l
    let d = o
    for (let e = 0; e < n; e++) {
      const t = Math.round(d) + 0.5
      i.moveTo(r, t), 0 === e ? i.lineTo(0, t) : i.lineTo(r - aa.SHORT_GRADUATION_SIZE, t), (d += c)
    }
  }
}

var ruler = {}
window.ruler = ruler
ruler.updateRuler = function (conf) {
  // {"ctx":{},"scaleFactor":1,"rulerUnit":50,"rulerHeight":24,"rulerWidth":469,"zeroGraduationPosition":{"x":313,"y":267}}
  this.state = {
    width: conf.width,
    height: conf.height,
  }
  this.setupCanvas(conf)
  conf.scene.paint(conf)
}
ruler.setupCanvas = function (conf) {
  const { width: e, height: t } = this.state
  if (conf.ctx) {
    const o = ruler.getDeviceRatio(conf.ctx),
      n = conf.ctx.canvas
    n.width = e * o
    n.height = t * o
    conf.ctx.fillStyle = 'rgb(43, 43, 43)'
    conf.ctx.fillRect(0, 0, n.width, n.height)
    conf.ctx.scale(o, o)
  }
}
ruler.getDeviceRatio = function (e) {
  if (!e) return 1
  return (
    (window.devicePixelRatio || 1) /
    (e.backingStorePixelRatio ||
      e.webkitBackingStorePixelRatio ||
      e.mozBackingStorePixelRatio ||
      e.msBackingStorePixelRatio ||
      e.oBackingStorePixelRatio ||
      e.backingStorePixelRatio ||
      1)
  )
}

window.aa = {
  GRADUATION_FONT_COLOR: 'rgba(153, 165, 190, 1)',
  GRADUATION_STROKE_COLOR: 'rgba(66, 81, 108, 1)',
  ACTIVE_AREA_COLOR: 'rgba(0, 157, 255, 0.2)',
  GRADUATION_FONT_SIZE: 12,
  SHORT_GRADUATION_SIZE: 8,
  RULE_SIZE: 24,
}

var xx = new rulerX()
var yy = new rulerY()

ruler.flushRuler = () => {
  const currentZoom = window.appState ? window.appState.zoom : 1
  ruler.updateRuler({
    ctx: document.querySelector('.ruler-canvas1').getContext('2d'),
    height: 24,
    width: window.getSceneInfo().sceneWidth,
    scene: xx,
    scaleFactor: currentZoom,
  })
  ruler.updateRuler({
    ctx: document.querySelector('.ruler-canvas2').getContext('2d'),
    height: window.getSceneInfo().sceneHeight,
    width: 24,
    scene: yy,
    scaleFactor: currentZoom,
  })
}
