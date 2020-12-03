<template>
  <div>
    <video
      ref="videoplayer"
      controls
      controlsList="nodownload noremoteplayback"
    >
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
      <div>Volume: {{ $refs.videoplayer.volume }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      VideoPlayer: null,
    }
  },

  computed: {},
  methods: {
    doSomething() {
      this.$refs.videoplayer.paused
        ? this.$refs.videoplayer.play()
        : this.$refs.videoplayer.pause()
    },
    addVolume() {
      if (this.$refs.videoplayer.volume < 1)
        this.$refs.videoplayer.volume = this.$refs.videoplayer.volume + 0.1
    },
    reduceVolume() {
      if (this.$refs.videoplayer.volume > 0)
        this.$refs.videoplayer.volume = this.$refs.videoplayer.volume - 0.1
    },
  },
}
</script>

<style></style>
