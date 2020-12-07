<template>
  <div>
    <canvas ref="canvas" class="" />
    <button @click="onStart">start</button>
    <button @click="onStop">stop</button>
  </div>
</template>

<script>
import IntervalTimer from '~/plugins/timer.js'
export default {
  data() {
    return {
      canvas: null,
      translate: false,
      pixels: 0,
      timer: null,
    }
  },
  watch: {
    translate(val) {
      console.log(val)
      let myVar = null
      if (val === true) {
        myVar = setInterval(this.moveCanvas, 10)
      } else {
        clearInterval(myVar)
      }
    },
  },
  mounted() {
    this.canvas = this.$refs.canvas
    this.rev(125)
    this.timer = new IntervalTimer('translate', this.moveCanvas, 10)
  },
  methods: {
    onStart() {
      this.timer.start()
    },
    onStop() {
      this.timer.pause()
    },
    moveCanvas() {
      // console.log(1)
      this.canvas.style.transform = `translateX(${this.pixels}px)`
      this.pixels -= 1
    },
    rev(time) {
      this.canvas.width = time * 100 + 100
      this.canvas.height = 150
      const ctx = this.canvas.getContext('2d')
      const startPoint = { x: 50, y: 50 }
      ctx.beginPath()

      for (let index = 0; index < time; index++) {
        startPoint.x += 25
        ctx.moveTo(startPoint.x, startPoint.y)

        ctx.lineTo(startPoint.x, startPoint.y + 30)
        startPoint.x += 25
        ctx.moveTo(startPoint.x, startPoint.y)
        ctx.lineTo(startPoint.x, startPoint.y + 20)
        startPoint.x += 25
        ctx.moveTo(startPoint.x, startPoint.y)
        ctx.lineTo(startPoint.x, startPoint.y + 10)
        ctx.fillText(`${index + 1}`, startPoint.x - 5, startPoint.y + 30)
        startPoint.x += 25
        ctx.moveTo(startPoint.x, startPoint.y)
        ctx.lineTo(startPoint.x, startPoint.y + 20)
      }
      ctx.stroke()
    },
    timeline(time) {
      this.canvas.width = time * 100 + 100
      this.canvas.height = window.innerHeight
      const ctx = this.canvas.getContext('2d')
      let startPoint = { x: 50, y: 50 }
      ctx.beginPath()
      ctx.moveTo(startPoint.x, startPoint.y)
      ctx.lineTo(startPoint.x, startPoint.y + 100)
      ctx.moveTo(startPoint.x, startPoint.y)

      const quotient = Math.floor(time / 60)
      const remainder = time % 60
      for (let index = 0; index < quotient; index++) {
        const minute = index
        for (let index = 0; index < 60; index++) {
          const endPoint = { x: startPoint.x + 100, y: startPoint.y }
          ctx.lineTo(endPoint.x, endPoint.y)
          if (index === 59) {
            ctx.lineTo(endPoint.x, endPoint.y + 100)
            ctx.fillText(
              `${minute}:${index + 1}`,
              endPoint.x - 10,
              endPoint.y + 110
            )
          } else {
            ctx.lineTo(endPoint.x, endPoint.y + 50)
            ctx.fillText(
              `${minute}:${index + 1}`,
              endPoint.x - 10,
              endPoint.y + 60
            )
          }
          ctx.moveTo(endPoint.x, endPoint.y)
          startPoint = endPoint
        }
      }
      for (let index = 0; index < remainder; index++) {
        const endPoint = { x: startPoint.x + 100, y: startPoint.y }
        ctx.lineTo(endPoint.x, endPoint.y)
        ctx.lineTo(endPoint.x, endPoint.y + 50)
        ctx.moveTo(endPoint.x, endPoint.y)
        startPoint = endPoint
      }
      ctx.stroke()
    },
  },
}
</script>

<style></style>
