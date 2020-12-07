<template>
  <div class="bg-gray-800 h-screen">
    <div class="flex flex-col mx-auto w-1/2">
      <div
        class="flex flex-col divide-y divide-purple-400 overflow-auto h-56 bg-gray-400"
      >
        <textarea-autosize
          v-for="(group, i) in captions.captionGroups"
          :key="i"
          ref="myTextarea"
          v-model="group.text"
          :min-height="30"
          rows="1"
          class="flex-none w-full h-full outline-none"
          @keyup.enter.native="printEnter"
        />
      </div>
      <div class="flex flex-col">
        <div class="flex space-x-1">
          <div class="flex flex-col w-16 -ml-16 mt-5">
            <button
              class="bg-red-500 px-6 py-1 rounded-sm"
              @click="doSomething"
            >
              Play
            </button>
            <button
              class="mr-4 px-6 py-1 rounded-sm text-red-500 text-2xl font-semibold"
              @click="addVolume"
            >
              +
            </button>
            <button
              class="px-6 py-1 rounded-sm text-red-500 text-2xl font-semibold"
              @click="reduceVolume"
            >
              -
            </button>
          </div>
          <div class="w-auto">
            <div class="h-7 py-auto">
              <vue-slider ref="slider" v-model="slideValue"></vue-slider>
            </div>

            <video
              ref="videoplayer"
              controls
              controlsList="nodownload noremoteplayback"
            >
              <source src="~/assets/videos/job.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      slideValue: 0,
      VideoPlayer: null,
      captions: {
        captionGroups: [
          { text: ' lorem', editTime: 0, syncTime: 0 },
          { text: ' asdfasfas sf', editTime: 0, syncTime: 0 },
          { text: 'asdfas fasf s', editTime: 0, syncTime: 0 },
          { text: 'asdfas safd', editTime: 0, syncTime: 0 },
          { text: 'asdf asdf', editTime: 0, syncTime: 0 },
          { text: ' lorem', editTime: 0, syncTime: 0 },
          { text: ' asdfasfas sf', editTime: 0, syncTime: 0 },
          { text: 'asdfas fasf s', editTime: 0, syncTime: 0 },
          { text: 'asdfas safd', editTime: 0, syncTime: 0 },
          { text: 'asdf asdf', editTime: 0, syncTime: 0 },
          { text: ' lorem', editTime: 0, syncTime: 0 },
          { text: ' asdfasfas sf', editTime: 0, syncTime: 0 },
          { text: 'asdfas fasf s', editTime: 0, syncTime: 0 },
          { text: 'asdfas safd', editTime: 0, syncTime: 0 },
          { text: 'asdf asdf', editTime: 0, syncTime: 0 },
          { text: ' lorem', editTime: 0, syncTime: 0 },
          { text: ' asdfasfas sf', editTime: 0, syncTime: 0 },
          { text: 'asdfas fasf s', editTime: 0, syncTime: 0 },
          { text: 'asdfas safd', editTime: 0, syncTime: 0 },
          { text: 'asdf asdf', editTime: 0, syncTime: 0 },
        ],
      },
    }
  },

  computed: {},
  methods: {
    printEnter() {
      console.log('Print enter')
    },
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
