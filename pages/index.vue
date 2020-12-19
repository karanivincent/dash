<template>
  <div class="bg-gray-800 h-screen pt-2 pb-12 grid grid-cols-5">
    <div class="col-span-1 col-start-1 text-center">
      <label
        class="px-6 py-2 font-semibold text-gray-200 bg-purple-600 cursor-pointer hover:bg-purple-700 focus:outline-none rounded-md"
      >
        <input
          type="file"
          accept="audio/*,video/*"
          class="hidden"
          @change="playSelectedvideo"
        />
        Upload
      </label>
    </div>
    <div class="flex flex-col h-screen justify-end col-span-3 col-start-2">
      <!-- text section -->
      <div
        class="flex flex-col overflow-y-auto h-full min-h-32 bg-gray-300 border-b-8"
      >
        <textarea-autosize
          v-for="(group, i) in captions.captionGroups"
          :id="`textarea-${i}`"
          :key="i"
          :ref="`textarea-${i}`"
          v-model="group.text"
          :min-height="30"
          rows="1"
          cols="20"
          class="flex-none h-full text-gray-800 border-b border-orange-300 font-semibold leading-loose text-lg outline-none px-2 py-1 bg-transparent focus:bg-white"
          @keydown.native="keypress($event, i)"
        />
      </div>
      <!-- video section -->
      <div class="flex flex-col max-h-1/2" @keydown="keypress($event)">
        <div class="flex space-x-2 h-auto overflow-visible">
          <!-- buttons div -->
          <div class="flex flex-col items-center w-10 -ml-12 mt-5 gap-2">
            <!-- play button -->
            <button
              class="px-1 py-1 rounded-md bg-gray-600 text-white hover:text-orange-400 text-2xl font-semibold focus:outline-none"
              @click="videoPlayPause"
            >
              <div v-if="videoPlayer.paused === true">
                <svg
                  class="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <div v-else>
                <svg
                  class="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
            </button>
            <!-- rewind button -->
            <button
              class="px-1 py-1 rounded-md bg-gray-600 text-white hover:text-orange-400 text-2xl font-semibold focus:outline-none"
              @click="seek('rewind')"
            >
              <svg
                class="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"
                ></path>
              </svg>
            </button>
            <!-- volume button -->
            <button
              class="flex flex-col items-center px-1 py-1 rounded-md bg-gray-600 text-white hover:text-orange-400 text-2xl font-semibold focus:outline-none"
              @click="addVolume"
            >
              <svg
                class="w-8 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <div class="h-4 text-xs font-thin">{{ videoPlayer.volume }}%</div>
            </button>
            <!-- playback speed button -->
            <button
              class="px-1 py-1 rounded-md bg-gray-600 text-white hover:text-orange-400 text-2xl font-semibold focus:outline-none"
              @click="setPlaybackspeed('fast')"
            >
              <svg
                class="w-8 h-5"
                viewBox="0 0 488.6 488.6"
                fill="currentColor"
              >
                <path
                  d="M188.5,270.3c-24.4,28.1-23.2,71.7,2.6,98.6c14.4,15.1,33.7,22.6,52.9,22.6c18.8,0,37.5-7.2,51.8-21.5
			              c6.5-6.5,11.6-14,15.1-21.9l0,0l94.5-183.2c2.5-5.2-2.9-10.6-8.1-8.1l-183.2,94.5l0,0C204.6,255.5,195.9,261.9,188.5,270.3z
			              M221.9,296.1c6.1-6.1,14.1-9.2,22.1-9.2s16,3.1,22.2,9.2c12.2,12.2,12.2,32.1,0,44.3c-6.1,6.1-14.1,9.2-22.2,9.2
			              c-8,0-16-3.1-22.1-9.2C209.6,328.1,209.6,308.3,221.9,296.1z M440.2,341.4c0-34.6-9.1-68.6-26.4-98.3c-6.7-11.6-2.8-26.4,8.8-33.1
			              c11.6-6.7,26.4-2.8,33.1,8.8c21.5,37.1,32.9,79.5,32.9,122.6c0,13.4-10.8,24.2-24.2,24.2C451.1,365.6,440.2,354.8,440.2,341.4z
			              M0,341.4C0,206.7,109.6,97.1,244.3,97.1c31.3,0,61.8,5.8,90.6,17.4c12.4,5,18.4,19,13.5,31.4c-5,12.4-19,18.4-31.4,13.5
			              c-23.1-9.2-47.6-13.9-72.7-13.9c-108,0-195.9,87.9-195.9,195.9c0,13.4-10.8,24.2-24.2,24.2C10.8,365.6,0,354.8,0,341.4z"
                />
              </svg>
              <div class="h-4 text-xs font-thin">
                {{ videoPlayer.playbackspeed }}%
              </div>
            </button>
            <!-- forward button -->
            <button
              class="px-1 py-1 rounded-md bg-gray-600 text-white hover:text-orange-400 text-2xl font-semibold focus:outline-none"
              @click="seek('forward')"
            >
              <svg
                class="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"
                ></path>
              </svg>
            </button>
          </div>
          <!-- video div -->
          <div class="w-auto">
            <!-- slider section -->
            <div
              class="flex items-center bg-gray-600 text-center text-gray-300"
            >
              <div class="w-16">{{ videoPlayer.currentTime }}</div>

              <div class="h-7 py-auto flex-grow">
                <vue-slider
                  ref="slider"
                  v-model="slideValue"
                  :drag-on-click="true"
                  :lazy="true"
                  :max="videoPlayer.duration"
                  :tooltip-formatter="(val) => timeFormat(val)"
                  @drag-start="videoPause"
                  @dragging="videoPause"
                  @drag-end="seek('slider')"
                ></vue-slider>
              </div>
              <div class="w-16">{{ videoPlayer.durationString }}</div>
            </div>

            <video
              ref="videoplayer"
              controls
              controlsList="nodownload noremoteplayback"
              preload="metadata"
              class="focus:outline-none h-auto"
              @click.prevent
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
      buffer: null,
      slideValue: 0,
      slider: null,
      video: null,
      videoPlayer: {
        paused: true,
        volume: 100,
        duration: 0,
        durationString: '00:00',
        currentTime: '00:00',
        playbackspeed: 100,
        seekInterval: {
          forward: 20,
          rewind: 2,
        },
      },
      captions: {
        captionGroups: [{ text: ' lorem', editTime: 1, syncTime: 0 }],
      },
    }
  },
  computed: {
    playerState() {
      return this.$refs.videoplayer
    },
  },
  mounted() {
    this.slider = this.$refs.slider
    this.video = this.$refs.videoplayer
    // update slider index on video timeupdate
    this.video.addEventListener('timeupdate', () => {
      this.slider.setIndex(Math.trunc(this.video.currentTime))
    })

    // set video duration on videoPlayer variable
    var setTime = (time) => {
      this.videoPlayer.duration = Math.trunc(time)
      this.videoPlayer.durationString = this.timeFormat(time)
    }
    this.video.onloadedmetadata = function () {
      setTime(this.duration)
    }
  },
  methods: {
    playSelectedvideo(event) {
      var file = event.target.files[0]
      if (file) {
        var type = file.type
        var videoNode = this.$refs.videoplayer
        var canPlay = videoNode.canPlayType(type)
        canPlay === '' ? (canPlay = false) : (canPlay = true)

        if (!canPlay) {
          console.log("Can't play video")
          return
        }

        var fileURL = URL.createObjectURL(file)
        videoNode.src = fileURL
        this.videoPlayer.paused = true
      }
    },
    getLineNumber(textarea) {
      console.log(
        'Linenumber:',
        textarea.value.substr(0, textarea.selectionStart).split('\n').length
      )
    },
    countLines(textarea) {
      if (this.buffer == null) {
        this.buffer = document.createElement('textarea')
        this.buffer.style.border = 'none'
        this.buffer.style.height = '0'
        this.buffer.style.overflow = 'hidden'
        this.buffer.style.padding = '0'
        this.buffer.style.position = 'absolute'
        this.buffer.style.left = '0'
        this.buffer.style.top = '0'
        this.buffer.style.zIndex = '-1'
        document.body.appendChild(this.buffer)
      }

      var cs = window.getComputedStyle(textarea)
      var pl = parseInt(cs.paddingLeft)
      var pr = parseInt(cs.paddingRight)
      var lh = parseInt(cs.lineHeight)

      // [cs.lineHeight] may return 'normal', which means line height = font size.
      if (isNaN(lh)) lh = parseInt(cs.fontSize)

      // Copy content width.
      this.buffer.style.width = textarea.clientWidth - pl - pr + 'px'

      // Copy text properties.
      this.buffer.style.font = cs.font
      this.buffer.style.letterSpacing = cs.letterSpacing
      this.buffer.style.whiteSpace = cs.whiteSpace
      this.buffer.style.wordBreak = cs.wordBreak
      this.buffer.style.wordSpacing = cs.wordSpacing
      this.buffer.style.wordWrap = cs.wordWrap

      // Copy value.
      this.buffer.value = textarea.value

      var result = Math.floor(this.buffer.scrollHeight / lh)
      if (result == 0) result = 1

      return result
    },

    setCaretPosition(elem, caretPos) {
      if (elem != null) {
        if (elem.$el.createTextRange) {
          var range = elem.$el.createTextRange()
          range.move('character', caretPos)
          range.select()
        } else {
          if (elem.$el.selectionStart) {
            elem.$el.focus()
            elem.$el.setSelectionRange(caretPos, caretPos)
          } else elem.$el.focus()
        }
      }
    },

    videoPause() {
      if (this.video.paused === false) {
        this.video.pause()
        this.videoPlayer.paused = true
      }
    },
    videoPlay() {
      if (this.video.paused === true) {
        this.video.play()
        this.videoPlayer.paused = false
      }
    },
    seek(source) {
      switch (source) {
        case 'forward':
          this.video.currentTime += this.videoPlayer.seekInterval.forward

          break
        case 'rewind':
          this.video.currentTime -= this.videoPlayer.seekInterval.rewind

          break
        case 'slider':
          this.video.currentTime = this.slider.getIndex()
          // this.video.onseeked = () => {
          //   this.videoPlay()
          // }
          break
      }
    },
    keypress(event, i = -1) {
      switch (event.key) {
        case 'ArrowUp':
          if (i != 0 && event.target.selectionEnd === 0) {
            var elem = this.$refs[`textarea-${i - 1}`][0]
            event.preventDefault()

            this.setCaretPosition(elem, event.target.selectionEnd)
          }
          break
        case 'ArrowDown':
          if (
            i < this.captions.captionGroups.length - 1 &&
            event.target.selectionEnd === event.target.value.length
          ) {
            elem = this.$refs[`textarea-${i + 1}`][0]

            event.preventDefault()

            this.setCaretPosition(elem, 0)
          }
          break
        case 'ArrowLeft':
          if (i != 0 && event.target.selectionEnd === 0) {
            elem = this.$refs[`textarea-${i - 1}`][0]
            event.preventDefault()

            this.setCaretPosition(elem, elem.value.length)
          }
          break
        case 'ArrowRight':
          if (
            i < this.captions.captionGroups.length - 1 &&
            event.target.selectionEnd === event.target.value.length
          ) {
            elem = this.$refs[`textarea-${i + 1}`][0]
            event.preventDefault()

            this.setCaretPosition(elem, 0)
          }
          break
        case 'Delete':
          if (
            i < this.captions.captionGroups.length - 1 &&
            event.target.selectionEnd === event.target.value.length
          ) {
            event.preventDefault()
            const currentCaption = this.captions.captionGroups[i]
            const nextCaption = this.captions.captionGroups[i + 1]
            currentCaption.text += nextCaption.text

            this.captions.captionGroups.splice(i + 1, 1)
            elem = this.$refs[`textarea-${i}`][0]
            const set_cursor = elem.value.length
            this.$nextTick(() => {
              this.setCaretPosition(elem, set_cursor)
            })
          }
          break
        case 'Backspace':
          if (i != 0 && event.target.selectionEnd === 0) {
            event.preventDefault()
            const precedingCaption = this.captions.captionGroups[i - 1]
            const currentCaption = this.captions.captionGroups[i]
            this.captions.captionGroups[i - 1].text =
              precedingCaption.text + currentCaption.text
            this.captions.captionGroups.splice(i, 1)
            elem = this.$refs[`textarea-${i - 1}`][0]
            const set_cursor = elem.value.length
            this.$nextTick(() => {
              this.setCaretPosition(elem, set_cursor)
            })
          }
          break
        case 'Enter':
          event.preventDefault()
          var cursor_location = event.target.selectionEnd
          var selection_end = event.target.value.length
          // select text
          var text = event.target.value
          var currentText = text.substring(0, cursor_location)
          this.captions.captionGroups[i].text = currentText
          var createdText = text.substring(cursor_location, selection_end)
          this.insertCaption(i, createdText)
          break
        case 'Tab':
          event.preventDefault()
          if (event.shiftKey) {
            event.preventDefault()
            this.seek('rewind')
          } else {
            this.videoPlayPause()
          }
      }
    },

    insertCaption(index, text) {
      // get current caption cursor position

      //  get current caption length
      // select text between cursor and end
      index = index + 1
      this.captions.captionGroups.splice(index, 0, {
        text: text,
        editTime: 0,
        syncTime: 0,
      })

      this.$nextTick(() => {
        var elem = this.$refs[`textarea-${index}`][0]
        this.setCaretPosition(elem, 0)
      })

      // if (index < this.captions.captionGroups.length - 1)
      //   this.$refs['textarea-' + index][0].$el.focus()
    },
    timeFormat(seconds) {
      var minutes = Math.floor(seconds / 60)
      var remainingSeconds = seconds % 60
      var formatedTime = ''

      if (minutes > 59) {
        var hours = Math.floor(minutes / 60)
        var remainingMinutes = minutes % 60
        if (hours > 23) {
          var days = Math.floor(hours / 24)
          var remainingHours = hours % 24
          formatedTime =
            days +
            ':' +
            ('00' + remainingHours).slice(-2) +
            ':' +
            ('00' + remainingMinutes).slice(-2) +
            ':' +
            ('00' + remainingSeconds).slice(-2)
        }
        formatedTime =
          ('00' + hours).slice(-2) +
          ':' +
          ('00' + remainingMinutes).slice(-2) +
          ':' +
          ('00' + remainingSeconds).slice(-2)
      } else {
        formatedTime =
          ('00' + minutes).slice(-2) + ':' + ('00' + remainingSeconds).slice(-2)
      }

      this.videoPlayer.currentTime = formatedTime

      return formatedTime
    },

    videoPlayPause() {
      if (this.video.paused) {
        this.videoPlay()
        this.videoPlay.paused = false
      } else {
        this.videoPause()
        this.videoPlayer.paused = true
      }
    },
    addVolume() {
      if (this.videoPlayer.volume < 100) this.videoPlayer.volume += 5

      this.$refs.videoplayer.volume = this.videoPlayer.volume / 100
    },
    reduceVolume() {
      if (this.videoPlayer.volume > 0) this.videoPlayer.volume -= 5

      this.$refs.videoplayer.volume = this.videoPlayer.volume / 100
    },
    setPlaybackspeed(speed) {
      switch (speed) {
        case 'fast':
          if (this.videoPlayer.playbackspeed < 200) {
            this.videoPlayer.playbackspeed += 10
            this.$refs.videoplayer.playbackRate =
              this.videoPlayer.playbackspeed / 100
          }
          break
        case 'slow':
          if (this.videoPlayer.playbackspeed > 0) {
            this.videoPlayer.playbackspeed -= 10
            this.$refs.videoplayer.playbackRate =
              this.videoPlayer.playbackspeed / 100
          }
          break
      }
    },
  },
}
</script>

<style></style>
