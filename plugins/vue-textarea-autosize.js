import Vue from 'vue'
import TextareaAutosize from 'vue-textarea-autosize'

Vue.use(TextareaAutosize)

// In Component:
// <textarea-autosize
//   placeholder="Type something here..."
//   ref="myTextarea"
//   v-model="value"
//   :min-height="30"
//   :max-height="350"
//   @blur.native="onBlurTextarea"
// />

/* <textarea-autosize
v-for="(group, i) in captions.captionGroups"
:key="i"
ref="myTextarea"
v-model="group.text"
:min-height="30"
rows="1"
class="w-full h-full outline-none"
@keyup.enter.native="printEnter"
/> */
