<template>
  <div>
    <video ref="videoplayer" controls controlsList="nodownload noremoteplayback">
      <source src="~/assets/videos/job.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div class="flex justify-around">
      <button class="bg-red-500 px-6 py-1 rounded-sm" @click="doSomething">
        Play/Pause
      </button>
      <div>
        <button
          class="px-6 py-1 rounded-sm text-red-500 text-2xl font-semibold"
          @click="reduceVolume"
        >
          -
        </button>
        <button
          class="mr-4 px-6 py-1 rounded-sm text-red-500 text-2xl font-semibold"
          @click="addVolume"
        >
          +
        </button>
      </div>
      <div>Volume: {{ VideoPlayer.volume }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      VideoPlayer: null,
      volume: 0.5,
    }
  },
  mounted() {
    this.VideoPlayer = this.$refs.videoplayer
  },
  methods: {
    doSomething() {
      this.VideoPlayer.paused
        ? this.VideoPlayer.play()
        : this.VideoPlayer.pause()
    },
    addVolume() {
      if (this.VideoPlayer.volume < 1)
        this.VideoPlayer.volume = this.VideoPlayer.volume + 0.1
    },
    reduceVolume() {
      if (this.VideoPlayer.volume > 0)
        this.VideoPlayer.volume = this.VideoPlayer.volume - 0.1
    },
  },
}
</script>

<style></style>
