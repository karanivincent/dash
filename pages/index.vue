<style>
div.test {
  overflow-y: scroll;
}
</style>

<template>
  <div class="bg-gray-800 h-screen pt-2 pb-12 grid grid-cols-5">
    <div class="col-span-1 col-start-1 text-center">
      <label
        class="px-6 py-2 font-semibold text-gray-200 bg-blue-600 cursor-pointer hover:bg-blue-700 focus:outline-none rounded-md"
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
      <div class="overflow-y-scroll h-full min-h-32 -mr-12">
        <div
          class="flex flex-col h-auto min-h-full border-b-8 bg-gray-300 mr-8"
        >
          <div
            v-for="(group, i) in captions.captionGroups"
            :key="i"
            class="flex-none border-b border-orange-300"
          >
            <div
              class="group flex bg-transparent text-gray-800 focus-within:bg-gray-100"
              :class="{
                'focus-within:bg-green-300':
                  group.text.length >= 20 && group.text.length < 40,
                'focus-within:bg-orange-300':
                  group.text.length >= 40 && group.text.length <= 60,
                'focus-within:bg-red-300 bg-red-300': group.text.length > 60,
              }"
            >
              <textarea-autosize
                :id="`textarea-${i}`"
                :ref="`textarea-${i}`"
                v-model="group.text"
                :min-height="30"
                rows="1"
                cols="20"
                :placeholder="group.placeholder"
                class="flex-grow inline h-full bg-transparent font-semibold leading-loose text-lg outline-none px-2 py-1"
                :class="{
                  'bg-blue-600 text-white':
                    view.select.active &&
                    i >= view.select.start &&
                    i <= view.select.end,
                }"
                @dblclick.native="view.select.end++"
                @paste.native="onPaste($event, i)"
                @keydown.native="keypress($event, i)"
                @mousedown.native="onMousedown($event, i)"
                @mouseover.native="onMouseover($event, i)"
                @mouseup.native="onMouseup($event, i)"
              />

              <div
                class="flex items-center pr-2 text-purple-700 text-opacity-75 font-medium cursor-pointer"
                @click="seek('edit', group.editTimestamp.value)"
              >
                {{ group.editTimestamp.string }}
              </div>
              <button
                class="bg-orange-500 text-white px-3 -mr-8 rounded-sm hidden group-hover:inline-block focus:outline-none"
                @click="deleteCaption(i)"
              >
                x
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- video section -->
      <div class="flex flex-col max-h-1/2" @keydown="keypress($event)">
        <div class="flex space-x-2 h-auto overflow-visible">
          <!-- buttons div -->
          <div class="flex flex-col items-center w-10 -ml-12 mt-5 gap-2">
            <!-- play button -->
            <button
              class="px-1 py-1 rounded-md bg-gray-600 text-white hover:text-blue-500 text-2xl font-semibold focus:outline-none"
              @click="videoPlayPause"
            >
              <div v-if="videoMeta.paused === true">
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
              class="px-1 py-1 rounded-md bg-gray-600 text-white hover:text-blue-500 text-2xl font-semibold focus:outline-none"
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
              class="relative flex flex-col items-center px-1 py-1 rounded-md bg-gray-600 text-white text-2xl font-semibold focus:outline-none"
              @click="view.volumeSlider = !view.volumeSlider"
            >
              <svg
                class="w-8 h-5 hover:text-blue-500"
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
              <div class="h-4 text-xs font-thin">{{ videoMeta.volume }}%</div>
              <div
                class="absolute rounded-md overflow-hidden text-sm text-gray-800 bg-gray-100 w-48 h-32 mt-10 z-10"
                :class="{
                  'flex flex-col': view.volumeSlider,
                  'hidden': !view.volumeSlider,
                }"
              >
                <div class="bg-blue-600 text-gray-100 py-1 h-8">Volume</div>
                <div class="flex px-1 pt-10 items-center">
                  <div>
                    <svg
                      class="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <div class="flex-grow px-2">
                    <vue-slider
                      ref="volume-slider"
                      v-model="videoMeta.volume"
                      tooltip="always"
                      :dot-size="12"
                      :interval="5"
                      :drag-on-click="true"
                      :lazy="true"
                      :max="100"
                      @change="setVolume"
                    ></vue-slider>
                  </div>
                  <div>
                    <svg
                      class="w-6 h-6"
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
                  </div>
                </div>
              </div>
            </button>
            <!-- playback speed button -->
            <button
              class="relative px-1 py-1 rounded-md bg-gray-600 text-white hover:text-blue-500 text-2xl font-semibold focus:outline-none"
              @click="view.speedSlider = !view.speedSlider"
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
                {{ videoMeta.playbackspeed }}%
              </div>
              <div
                class="absolute rounded-md overflow-hidden text-sm text-gray-800 bg-gray-100 w-48 h-32 -ml-20 z-10"
                :class="{
                  'flex flex-col': view.speedSlider,
                  'hidden': !view.speedSlider,
                }"
              >
                <div class="bg-blue-600 text-gray-100 py-1 h-8">Speed</div>
                <div class="flex px-1 pt-10 items-center">
                  <div>Min</div>
                  <div class="flex-grow px-2">
                    <vue-slider
                      ref="speed-slider"
                      v-model="videoMeta.playbackspeed"
                      tooltip="always"
                      :dot-size="12"
                      :interval="5"
                      :drag-on-click="true"
                      :lazy="true"
                      :max="200"
                      @change="setPlaybackspeed"
                    ></vue-slider>
                  </div>
                  <div>Max</div>
                </div>
                <div class="text-opacity-50">|</div>
                <div>100%</div>
              </div>
            </button>
            <!-- forward button -->
            <button
              class="px-1 py-1 rounded-md bg-gray-600 text-white hover:text-blue-500 text-2xl font-semibold focus:outline-none"
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
              <div class="w-16">{{ videoMeta.currentTime }}</div>

              <div class="h-7 py-auto flex-grow">
                <vue-slider
                  ref="slider"
                  v-model="slideValue"
                  :drag-on-click="true"
                  :lazy="true"
                  :max="videoMeta.duration"
                  :tooltip-formatter="(val) => timeFormat(val)"
                  @drag-start="videoPause"
                  @dragging="videoPause"
                  @drag-end="seek('slider')"
                ></vue-slider>
              </div>
              <div class="w-16">{{ videoMeta.durationString }}</div>
            </div>

            <video
              ref="videoMeta"
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
      view: {
        volumeSlider: false,
        speedSlider: false,
        select: {
          active: false,
          start: -1,
          end: -1,
          direction: 'down',
          mousedown: {
            index: 0,
            active: false,
          },
          mouseover: {
            index: 0,
          },
          mouseup: {
            index: 0,
          },
        },
      },
      buffer: null,
      slideValue: 0,
      slider: null,
      video: null,
      videoMeta: {
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
        captionGroups: [
          {
            text: '',
            placeholder: 'Start typing here...',
            editTimestamp: { value: 0, string: '00:00:00' },
            syncTimestamp: 0,
          },
        ],
      },
    }
  },
  computed: {
    playerState() {
      return this.$refs.videoMeta
    },
  },
  mounted() {
    this.slider = this.$refs.slider
    this.video = this.$refs.videoMeta
    // update slider index on video timeupdate
    this.video.addEventListener('timeupdate', () => {
      this.slider.setIndex(Math.trunc(this.video.currentTime))
    })

    // set video duration on videoMeta variable
    var setTime = (time) => {
      this.videoMeta.duration = Math.trunc(time)
      this.videoMeta.durationString = this.timeFormat(time)
    }
    this.video.onloadedmetadata = function () {
      setTime(this.duration)
    }
  },
  methods: {
    onMousedown(event, index) {
      this.view.select.mousedown.index = index
      this.view.select.mousedown.active = true
    },
    onMouseup(event, index) {
      if (this.view.select.mousedown.index == index) {
        this.view.select.active = false
        this.view.select.start = -1
        this.view.select.end = -1
      }
      this.view.select.mousedown.index = index
      this.view.select.mousedown.active = false
    },
    onMouseover(event, index) {
      console.log(event)
      if (this.view.select.mousedown.active == true) {
        if (index > this.view.select.mousedown.index) {
          this.view.select.active = true
          this.view.select.start = this.view.select.mousedown.index
          this.view.select.end = index
          this.view.select.direction = 'down'
        } else {
          this.view.select.active = true
          this.view.select.start = index
          this.view.select.end = this.view.select.mousedown.index
          this.view.select.direction = 'up'
        }
        event.target.classList.add('bg-blue-600', 'text-gray-100')
      }
      event.preventDefault()
    },
    playSelectedvideo(event) {
      var file = event.target.files[0]
      if (file) {
        var type = file.type
        var videoNode = this.$refs.videoMeta
        var canPlay = videoNode.canPlayType(type)
        canPlay === '' ? (canPlay = false) : (canPlay = true)

        if (!canPlay) {
          console.log("Can't play video")
          return
        }

        var fileURL = URL.createObjectURL(file)
        videoNode.src = fileURL
        this.videoMeta.paused = true
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
        this.videoMeta.paused = true
      }
    },
    videoPlay() {
      if (this.video.paused === true) {
        this.video.play()
        this.videoMeta.paused = false
      }
    },
    seek(source, time = 0) {
      switch (source) {
        case 'forward':
          this.video.currentTime += this.videoMeta.seekInterval.forward

          break
        case 'rewind':
          this.video.currentTime -= this.videoMeta.seekInterval.rewind

          break
        case 'slider':
          this.video.currentTime = this.slider.getIndex()
          break
        case 'edit':
          this.video.currentTime = time
          break
      }
    },
    onPaste(event, index) {
      let pasteData = event.clipboardData.getData('text')
      let pasteArray = pasteData.split(/[\r\n]+/)
      let pasteTime = this.captions.captionGroups[index].editTimestamp
      console.log('Length:', pasteArray.length)

      if (pasteArray.length > 1) {
        // performance testing
        // var t0 = performance.now()

        var cursor_location = event.target.selectionEnd
        var selection_end = event.target.value.length
        var text = event.target.value
        var startText = text.substring(0, cursor_location)
        var endText = text.substring(cursor_location, selection_end)

        for (let i = 0; i < pasteArray.length; i++) {
          if (i == 0) {
            this.captions.captionGroups[index].text = startText + pasteArray[i]
          } else if (i == pasteArray.length - 1) {
            let text = pasteArray[i].trim()

            if (text != '') {
              this.captions.captionGroups.splice(index, 0, {
                text: text + ' ' + endText,
                editTimestamp: pasteTime,
                syncTimestamp: 0,
              })
            }
          } else {
            let text = pasteArray[i].trim()
            if (text != '') {
              this.captions.captionGroups.splice(index, 0, {
                text: text + ' ',
                editTimestamp: pasteTime,
                syncTimestamp: 0,
              })
            }
          }
          index++
        }
        event.preventDefault()

        // performance testing
        // this.$nextTick(() => {
        //   var t3 = performance.now()
        //   var seconds = (t3 - t0) / 1000
        //   console.log('Next tick')
        //   console.log('Seconds:', seconds)
        //   console.log('Milliseconds: ', t3 - t0)
        // })
        // var t1 = performance.now()
        // var seconds = (t1 - t0) / 1000
        // console.log('Javascript')
        // console.log('Seconds:', seconds)
        // console.log('Milliseconds: ', t1 - t0)
        return
      }
    },
    keypress(event, i = -1) {
      console.log(event.key)
      switch (event.key) {
        case 'ArrowUp':
          if (i != 0 && event.target.selectionEnd === 0) {
            let elem = this.$refs[`textarea-${i - 1}`][0]
            event.preventDefault()

            this.setCaretPosition(elem, event.target.selectionEnd)
          }
          break
        case 'ArrowDown':
          if (
            i < this.captions.captionGroups.length - 1 &&
            event.target.selectionEnd === event.target.value.length
          ) {
            let elem = this.$refs[`textarea-${i + 1}`][0]

            event.preventDefault()

            this.setCaretPosition(elem, 0)
          }
          break
        case 'ArrowLeft':
          if (i != 0 && event.target.selectionEnd === 0) {
            let elem = this.$refs[`textarea-${i - 1}`][0]
            event.preventDefault()

            this.setCaretPosition(elem, elem.value.length)
          }
          break
        case 'ArrowRight':
          if (
            i < this.captions.captionGroups.length - 1 &&
            event.target.selectionEnd === event.target.value.length
          ) {
            let elem = this.$refs[`textarea-${i + 1}`][0]
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
            let elem = this.$refs[`textarea-${i}`][0]
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
            let elem = this.$refs[`textarea-${i - 1}`][0]
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
          var startText = text.substring(0, cursor_location).trim()
          var sentenceEnd = startText.search(/[?.!]$/)
          sentenceEnd == -1 ? (sentenceEnd = false) : (sentenceEnd = true)
          this.captions.captionGroups[i].text = startText + ' '
          var endText = text.substring(cursor_location, selection_end)
          this.insertCaption(i, endText, this.video.currentTime)
          break
        case 'Tab':
          event.preventDefault()
          if (event.shiftKey) {
            this.seek('rewind')
          } else {
            this.videoPlayPause()
          }
          break
        case ' ':
          // capitalize first letter
          this.firstLettercaps(i)
          var originalValue = event.target.value
          var finalValue = originalValue.replace(/(\bi\b)/g, (letter) =>
            letter.toUpperCase()
          )
          event.target.value = finalValue

          break
        case 'c':
          if (event.ctrlKey && this.view.select.active) {
            event.preventDefault()
            let select = this.view.select
            let selectedText = ''
            if (this.view.select.direction === 'down') {
              for (let index = select.start; index <= select.end; index++) {
                let elem = this.$refs[`textarea-${index}`][0]
                selectedText += elem.value + '\n'
              }
            }
            if (this.view.select.direction === 'up') {
              for (let index = select.end; index <= select.start; index++) {
                let elem = this.$refs[`textarea-${index}`][0]
                selectedText += elem.value + '\n'
              }
            }
            this.copyToClipboard(selectedText)
            // copy selection
          }
      }
    },
    firstLettercaps(i) {
      if (i != 0) {
        var elem = this.$refs[`textarea-${i - 1}`][0]
        var sentenceStart = elem.value.search(/[?.!] $/)
        sentenceStart == -1 ? (sentenceStart = false) : (sentenceStart = true)
        if (sentenceStart) {
          var originalValue = event.target.value
          var finalValue = originalValue.replace(/(^\w{1})/g, (letter) =>
            letter.toUpperCase()
          )
          event.target.value = finalValue
        }
      } else {
        originalValue = event.target.value
        finalValue = originalValue.replace(/(^\w{1})/g, (letter) =>
          letter.toUpperCase()
        )
        event.target.value = finalValue
      }
    },
    copyToClipboard(text) {
      if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData('Text', text)
      } else if (
        document.queryCommandSupported &&
        document.queryCommandSupported('copy')
      ) {
        var textarea = document.createElement('textarea')
        textarea.textContent = text
        textarea.style.position = 'fixed' // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea)
        textarea.select()
        try {
          return document.execCommand('copy') // Security exception may be thrown by some browsers.
        } catch (ex) {
          console.warn('Copy to clipboard failed.', ex)
          return false
        } finally {
          document.body.removeChild(textarea)
        }
      }
    },
    insertCaption(index, text, time) {
      var roundedTime = Math.round((time + Number.EPSILON) * 100) / 100

      var formatTime = (seconds) => {
        var splitArray = seconds.toString().split('.')
        var wholePart = this.timeFormat(splitArray[0])
        var decimalPart = splitArray[1]

        return wholePart + '.' + decimalPart
      }
      var timeString = formatTime(roundedTime.toFixed(2))
      index = index + 1
      this.captions.captionGroups.splice(index, 0, {
        text: text,
        editTimestamp: { value: time, string: timeString },
        syncTimestamp: 0,
      })

      this.$nextTick(() => {
        let elem = this.$refs[`textarea-${index}`][0]
        this.setCaretPosition(elem, 0)
      })
    },
    deleteCaption(index) {
      if (this.captions.captionGroups.length != 1)
        this.captions.captionGroups.splice(index, 1)
      else {
        this.captions.captionGroups[index].text = ''
        this.captions.captionGroups[index].editTimestamp = {
          value: 0,
          string: '00:00:00',
        }
        this.captions.captionGroups[index].syncTimestamp = 0
      }
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

      this.videoMeta.currentTime = formatedTime

      return formatedTime
    },

    videoPlayPause() {
      if (this.video.paused) {
        this.videoPlay()
        this.videoPlay.paused = false
      } else {
        this.videoPause()
        this.videoMeta.paused = true
      }
    },
    setVolume() {
      this.$refs.videoMeta.volume = this.videoMeta.volume / 100
    },
    addVolume() {
      if (this.videoMeta.volume < 100) this.videoMeta.volume += 5

      this.$refs.videoMeta.volume = this.videoMeta.volume / 100
    },
    reduceVolume() {
      if (this.videoMeta.volume > 0) this.videoMeta.volume -= 5

      this.$refs.videoMeta.volume = this.videoMeta.volume / 100
    },
    setPlaybackspeed() {
      this.$refs.videoMeta.playbackRate = this.videoMeta.playbackspeed / 100
    },
  },
}
</script>
