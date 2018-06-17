<template>

  <div >
    <div class="offset no-changes" v-bind:style= "{width : field.offset + 'px'}"></div>
        <div class="width easing"  :class="{draggable: draggable, resizable: resizable, active: enabled, dragging: dragging, resizing: resizing }"

            @mousedown.stop="elmDown"
            @touchstart.prevent.stop="elmDown"
            @dblclick="fillParent" v-bind:style= "{width : field.width + 'px'}">
            <div class="nested hidden">
            <i class="icon-th"></i>
            </div>
            <div class="classes">
              <div class="xs-width">xs-{{field.xs}}</div>
              <div class="xs-offset">xs-offset-{{field.xs_offset}}</div>
              <div class="sm-width">sm{{field.sm}}</div>
              <div class="sm-offset">sm-offset-{{field.sm_offset}}</div>
              <div class="md-width">md-{{field.md}}</div>
              <div class="md-offset">md-offset-{{field.md_offset}}</div>
              <div class="lg-width">lg-{{field.lg}}</div>
              <div class="lg-offset">lg-offset-{{field.lg_offset}}</div>
            </div>
            <div v-for="handle in handles" v-if="resizable" class="handle" :key="handle" :class="'handle-' + handle" :style="{ display: enabled ? 'block' : 'none'}"
                  @mousedown.stop.prevent="handleDown(handle, $event)"   @touchstart.stop.prevent="handleDown(handle, $event)">
            </div>
            <slot></slot>
            <div class="form-group" v-if="fieldVisible(field)">
              <label v-if="fieldTypeHasLabel(field)" :for="getFieldID(field)" :class="field.labelClasses">
                  {{ field.label }}
                <span class="help" v-if="field.help">
                  <i class="icon"></i>
                  <div class="helpText" v-html="field.help"></div>
                </span>
              </label>
              <div class="field-wrap">
                <component :is="getFieldType(field)" :disabled="fieldDisabled(field)" :schema="field"></component>
                <div class="buttons" v-if="buttonVisibility(field)">
                  <button v-for="(btn,index) in field.buttons" :key="index"  :class="btn.classes"> {{ btn.label }}</button>
                </div>
              <div class="hint" v-if="field.hint"> {{ fieldHint(field) }}</div>
              </div>
            </div>
        </div>
  </div>

</template>

<script>

import { matchesSelectorToParentElements } from './utils/dom'
import { isFunction, isNil } from 'lodash'
import { slugifyFormID } from './utils/schema'

import fieldCheckbox from './fields/core/fieldCheckbox.vue'
import fieldChecklist from './fields/core/fieldChecklist.vue'
import fieldInput from './fields/core/fieldInput.vue'
import fieldLabel from './fields/core/fieldLabel.vue'
import fieldSelect from './fields/core/fieldSelect.vue'
import fieldSubmit from './fields/core/fieldSubmit.vue'
import fieldTextArea from './fields/core/fieldTextArea.vue'
import fieldUpload from './fields/core/fieldUpload.vue'
import fieldRadios from './fields/core/fieldRadios.vue'

import fieldCleave from './fields/optional/fieldCleave.vue'
import fieldDateTimePicker from './fields/optional/fieldDateTimePicker.vue'
import fieldGoogleAddress from './fields/optional/fieldGoogleAddress.vue'
import fieldImage from './fields/optional/fieldImage.vue'
import fieldMasked from './fields/optional/fieldMasked.vue'
import fieldNoUiSlider from './fields/optional/fieldNoUiSlider.vue'
import fieldPikaday from './fields/optional/fieldPikaday.vue'
import fieldRangeSlider from './fields/optional/fieldRangeSlider.vue'
import fieldSelectEx from './fields/optional/fieldSelectEx.vue'
import fieldSpectrum from './fields/optional/fieldSpectrum.vue'
import fieldStaticMap from './fields/optional/fieldStaticMap.vue'
import fieldSwitch from './fields/optional/fieldSwitch.vue'
import fieldVueMultiSelect from './fields/optional/fieldVueMultiSelect.vue'

export default {

  replace: true,

  name: 'resize-observer',
  components: {
    fieldCheckbox,
    fieldRadios,
    fieldChecklist,
    fieldInput,
    fieldLabel,
    fieldSelect,
    fieldSubmit,
    fieldTextArea,
    fieldUpload,
    fieldDateTimePicker,
    fieldCleave,
    fieldGoogleAddress,
    fieldImage,
    fieldMasked,
    fieldNoUiSlider,
    fieldPikaday,
    fieldRangeSlider,
    fieldSelectEx,
    fieldSpectrum,
    fieldSwitch,
    fieldVueMultiSelect,
    fieldStaticMap
  },
  props: {
    field: {},

    preview: {type: String},
    indexpos: -1,

    active: {

      type: Boolean, default: false

    },

    draggable: {

      type: Boolean, default: true

    },

    resizable: {

      type: Boolean, default: true

    },

    w: {

      type: Number,

      default: 200,

      validator: function (val) {
        return val > 0
      }

    },

    h: {

      type: Number,

      default: 200,

      validator: function (val) {
        return val > 0
      }

    },

    minw: {

      type: Number,

      default: 50,

      validator: function (val) {
        return val >= 0
      }

    },

    minh: {

      type: Number,

      default: 50,

      validator: function (val) {
        return val >= 0
      }

    },

    x: {

      type: Number,

      default: 0,

      validator: function (val) {
        return typeof val === 'number'
      }

    },

    y: {

      type: Number,

      default: 0,

      validator: function (val) {
        return typeof val === 'number'
      }

    },

    z: {

      type: [ String, Number ],

      default: 'auto',

      validator: function (val) {
        let valid = (typeof val === 'string') ? val === 'auto' : val >= 0

        return valid
      }

    },

    handles: {

      type: Array,

      default: function () {
        return ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']
      },

      validator: function (val) {
        var s = new Set(['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'])

        return new Set(val.filter(h => s.has(h))).size === val.length
      }

    },

    dragHandle: {

      type: String,

      default: null

    },

    dragCancel: {

      type: String,

      default: null

    },

    axis: {

      type: String,

      default: 'both',

      validator: function (val) {
        return ['x', 'y', 'both'].indexOf(val) !== -1
      }

    },

    grid: {

      type: Array,

      default: function () {
        return [1, 1]
      }

    },

    parent: {

      type: Boolean, default: false

    },

    maximize: {

      type: Boolean, default: false

    }

  },

  created: function () {
    this.parentX = 0

    this.parentW = 9999

    this.parentY = 0

    this.parentH = 9999

    this.mouseX = 0

    this.mouseY = 0

    this.lastMouseX = 0

    this.lastMouseY = 0

    this.mouseOffX = 0

    this.mouseOffY = 0

    this.elmX = 0

    this.elmY = 0

    this.elmW = 0

    this.elmH = 0
  },

  mounted: function () {
    document.documentElement.addEventListener('mousemove', this.handleMove, true)

    document.documentElement.addEventListener('mousedown', this.deselect, true)

    document.documentElement.addEventListener('mouseup', this.handleUp, true)

    // touch events bindings

    document.documentElement.addEventListener('touchmove', this.handleMove, true)

    document.documentElement.addEventListener('touchend touchcancel', this.deselect, true)

    document.documentElement.addEventListener('touchstart', this.handleUp, true)

    this.elmX = parseInt(this.$el.style.left)

    this.elmY = parseInt(this.$el.style.top)

    this.elmW = this.$el.offsetWidth || this.$el.clientWidth

    this.elmH = this.$el.offsetHeight || this.$el.clientHeight

    this.datos.xs = this.field.xs
    this.datos.sm = this.field.sm
    this.datos.md = this.field.md
    this.datos.lg = this.field.lg
    this.datos.xs_offset = this.field.xs_offset
    this.datos.sm_offset = this.field.sm_offset
    this.datos.md_offset = this.field.md_offset
    this.datos.lg_offset = this.field.lg_offset
    this.datos.width = this.field.width
    this.datos.offset = this.field.offset
    let key
    for (key in this.field) {
      if (key !== 'width' && key !== 'offset' && key !== 'xs' && key !== 'sm' && key !== 'md' && key !== 'lg' && key !== 'xs_offset' && key !== 'sm_offset' && key !== 'md_offset' && key !== 'lg_offset') {
        this.datos[key] = this.field[key]
      }
    }

    this.reviewDimensions()
  },

  beforeDestroy: function () {
    document.documentElement.removeEventListener('mousemove', this.handleMove, true)

    document.documentElement.removeEventListener('mousedown', this.deselect, true)

    document.documentElement.removeEventListener('mouseup', this.handleUp, true)

    // touch events bindings removed

    document.documentElement.addEventListener('touchmove', this.handleMove, true)

    document.documentElement.addEventListener('touchend touchcancel', this.deselect, true)

    document.documentElement.addEventListener('touchstart', this.handleUp, true)
  },

  data: function () {
    return {

      top: this.y,

      left: this.x,

      width: this.w,

      height: this.h,

      resizing: false,

      dragging: false,

      enabled: this.active,

      handle: null,

      zIndex: this.z,

      datos: {
        xs: 0,
        sm: 0,
        md: 0,
        lg: 0,
        xs_offset: 0,
        sm_offset: 0,
        md_offset: 0,
        lg_offset: 0,
        width: 0,
        offset: 0,
        order: 0
      }

    }
  },
  methods: {
    // Get visible prop of field
    fieldVisible (field) {
      if (isFunction(field.visible)) { return field.visible.call(this, this.model, field, this) }

      if (isNil(field.visible)) { return true }

      return field.visible
    },
    // Get disabled attr of field
    fieldDisabled (field) {
      if (isFunction(field.disabled)) { return field.disabled.call(this, this.model, field, this) }

      if (isNil(field.disabled)) { return false }

      return field.disabled
    },

    // Get required prop of field
    fieldRequired (field) {
      if (isFunction(field.required)) { return field.required.call(this, this.model, field, this) }

      if (isNil(field.required)) { return false }

      return field.required
    },
    // Get readonly prop of field
    fieldReadonly (field) {
      if (isFunction(field.readonly)) { return field.readonly.call(this, this.model, field, this) }

      if (isNil(field.readonly)) { return false }

      return field.readonly
    },
    // Get type of field 'field-xxx'. It'll be the name of HTML element
    getFieldType (fieldSchema) {
      return 'field-' + fieldSchema.type
    },
    // Should field type have a label?
    fieldTypeHasLabel (field) {
      if (isNil(field.label)) return false

      let relevantType = ''
      if (field.type === 'input') {
        relevantType = field.inputType
      } else {
        relevantType = field.type
      }

      switch (relevantType) {
        case 'button':
        case 'submit':
        case 'reset':
          return false
        default:
          return true
      }
    },
    getFieldID (schema) {
      const idPrefix = this.options && this.options.fieldIdPrefix ? this.options.fieldIdPrefix : ''
      return slugifyFormID(schema, idPrefix)
    },
    buttonVisibility (field) {
      return field.buttons && field.buttons.length > 0
    },
    // Get current hint.
    fieldHint (field) {
      if (isFunction(field.hint)) { return field.hint.call(this, this.model, field, this) }

      return field.hint
    },
    reviewDimensions: function () {
      if (this.minw > this.w) this.width = this.minw
      if (this.minh > this.h) this.height = this.minh
      if (this.parent) {
        const parentW = parseInt(this.$el.parentNode.clientWidth, 10)
        const parentH = parseInt(this.$el.parentNode.clientHeight, 10)
        this.parentW = parentW
        this.parentH = parentH
        if (this.w > this.parentW) this.width = parentW
        if (this.h > this.parentH) this.height = parentH
        if ((this.x + this.w) > this.parentW) this.width = parentW - this.x
        if ((this.y + this.h) > this.parentH) this.height = parentH - this.y
      }
      this.elmW = this.width
      this.elmH = this.height
      this.$emit('resizing', this.left, this.top, this.width, this.height, this.indexpos)
    },

    elmDown: function (e) {
      const target = e.target || e.srcElement
      if (this.$el.contains(target)) {
        if (
          (this.dragHandle && !matchesSelectorToParentElements(target, this.dragHandle, this.$el)) ||
          (this.dragCancel && matchesSelectorToParentElements(target, this.dragCancel, this.$el))) {
          return
        }
        this.reviewDimensions()
        if (!this.enabled) {
          this.enabled = true
          this.$emit('activated', this.indexpos)
          this.$emit('update:active', true, this.indexpos)
        }

        if (this.draggable) {
          this.dragging = true
        }
      }
    },

    deselect: function (e) {
      if (e.type.indexOf('touch') !== -1) {
        this.mouseX = e.changedTouches[0].clientX
        this.mouseY = e.changedTouches[0].clientY
      } else {
        this.mouseX = e.pageX || e.clientX + document.documentElement.scrollLeft
        this.mouseY = e.pageY || e.clientY + document.documentElement.scrollTop
      }

      this.lastMouseX = this.mouseX
      this.lastMouseY = this.mouseY
      const target = e.target || e.srcElement
      const regex = new RegExp('handle-([trmbl]{2})', '')
      if (!this.$el.contains(target) && !regex.test(target.className)) {
        if (this.enabled) {
          this.enabled = false
          this.$emit('deactivated', this.indexpos)
          this.$emit('update:active', false, this.indexpos)
        }
      }
    },

    handleDown: function (handle, e) {
      this.handle = handle
      if (e.stopPropagation) e.stopPropagation()
      if (e.preventDefault) e.preventDefault()
      this.resizing = true
    },

    fillParent: function (e) {
      if (!this.parent || !this.resizable || !this.maximize) return
      let done = false
      const animate = () => {
        if (!done) {
          window.requestAnimationFrame(animate)
        }

        if (this.axis === 'x') {
          if (
            this.width === this.parentW && this.left === this.parentX
          ) done = true
        } else if (this.axis === 'y') {
          if (
            this.height === this.parentH && this.top === this.parentY
          ) done = true
        } else if (this.axis === 'both') {
          if (
            this.width === this.parentW &&
            this.height === this.parentH &&
            this.top === this.parentY &&
            this.left === this.parentX
          ) done = true
        }
        if (this.axis === 'x' || this.axis === 'both') {
          if (this.width < this.parentW) {
            this.width++
            this.elmW++
          }
          if (this.left > this.parentX) {
            this.left--
            this.elmX--
          }
        }
        if (this.axis === 'y' || this.axis === 'both') {
          if (this.height < this.parentH) {
            this.height++
            this.elmH++
          }
          if (this.top > this.parentY) {
            this.top--
            this.elmY--
          }
        }
        this.$emit('resizing', this.left, this.top, this.width, this.height, this.indexpos)
      }

      window.requestAnimationFrame(animate)
    },

    handleMove: function (e) {
      const isTouchMove = e.type.indexOf('touchmove') !== -1

      this.mouseX = isTouchMove
        ? e.touches[0].clientX
        : e.pageX || e.clientX + document.documentElement.scrollLeft
      this.mouseY = isTouchMove
        ? e.touches[0].clientY
        : e.pageY || e.clientY + document.documentElement.scrollTop
      let diffX = this.mouseX - this.lastMouseX + this.mouseOffX
      let diffY = this.mouseY - this.lastMouseY + this.mouseOffY
      this.mouseOffX = this.mouseOffY = 0
      this.lastMouseX = this.mouseX
      this.lastMouseY = this.mouseY
      let dX = diffX
      let dY = diffY
      if (this.resizing) {
        if (this.handle.indexOf('t') >= 0) {
          if (this.elmH - dY < this.minh) this.mouseOffY = (dY - (diffY = this.elmH - this.minh))
          else if (this.parent && this.elmY + dY < this.parentY) this.mouseOffY = (dY - (diffY = this.parentY - this.elmY))
          this.elmY += diffY
          this.elmH -= diffY
        }

        if (this.handle.indexOf('b') >= 0) {
          if (this.elmH + dY < this.minh) this.mouseOffY = (dY - (diffY = this.minh - this.elmH))
          else if (this.parent && this.elmY + this.elmH + dY > this.parentH) this.mouseOffY = (dY - (diffY = this.parentH - this.elmY - this.elmH))
          this.elmH += diffY
        }

        if (!this.elmX) {
          this.elmX = 0
        }

        if (this.handle.indexOf('l') >= 0) {
          if (this.elmW - dX < this.minw) this.mouseOffX = (dX - (diffX = this.elmW - this.minw))

          else if (this.parent && this.elmX + dX < this.parentX) this.mouseOffX = (dX - (diffX = this.parentX - this.elmX))

          this.elmX += diffX

          // this.elmW -= diffX no varia el ancho
        }

        if (this.handle.indexOf('r') >= 0) {
          if (this.elmW + dX < this.minw) this.mouseOffX = (dX - (diffX = this.minw - this.elmW))

          else if (this.parent && this.elmX + this.elmW + dX > this.parentW) this.mouseOffX = (dX - (diffX = this.parentW - this.elmX - this.elmW))
          this.elmW += diffX
        }

        this.left = (Math.round(this.elmX / this.grid[0]) * this.grid[0])
        this.top = (Math.round(this.elmY / this.grid[1]) * this.grid[1])
        this.width = (Math.round(this.elmW / this.grid[0]) * this.grid[0])
        this.height = (Math.round(this.elmH / this.grid[1]) * this.grid[1])
        if ((this.datos.width === undefined) || (this.datos.width !== this.width && (this.width / this.grid[0] + this.datos.offset / this.grid[0]) <= 12)) {
          this.datos[this.preview] = this.width / this.grid[0]
          this.datos.width = this.width
        }
        if (this.datos.offset !== this.left + this.field.offset) {
          if (this.field[this.preview + '_offset'] !== undefined && (this.datos[this.preview] + this.left / this.grid[0] + this.field[this.preview + '_offset']) <= 12) {
            this.datos[this.preview + '_offset'] = (this.left / this.grid[0] + this.field[this.preview + '_offset'])
            this.datos.offset = this.left + this.field.offset
          } else if ((this.datos[this.preview] + (this.left + this.field.offset) / this.grid[0]) <= 12) {
            this.datos[this.preview + '_offset'] = ((this.left + this.field.offset) / this.grid[0])
            this.datos.offset = this.left + this.field.offset
          }
        }
        if (this.datos[this.preview + '_offset'] < 0) {
          this.datos[this.preview + '_offset'] = 0
          this.datos.offset = 0
        }
        this.$emit('input', this.datos)
        this.$emit('resizing', this.left, this.top, this.width, this.height, this.indexpos)
      } else if (this.dragging) {
        if (this.parent) {
          if (this.elmX + dX < this.parentX) this.mouseOffX = (dX - (diffX = this.parentX - this.elmX))
          else if (this.elmX + this.elmW + dX > this.parentW) this.mouseOffX = (dX - (diffX = this.parentW - this.elmX - this.elmW))
          if (this.elmY + dY < this.parentY) this.mouseOffY = (dY - (diffY = this.parentY - this.elmY))
          else if (this.elmY + this.elmH + dY > this.parentH) this.mouseOffY = (dY - (diffY = this.parentH - this.elmY - this.elmH))
        }

        this.elmX += diffX

        this.elmY += diffY

        if (this.axis === 'x' || this.axis === 'both') {
          this.left = (Math.round(this.elmX / this.grid[0]) * this.grid[0])
        }

        if (this.axis === 'y' || this.axis === 'both') {
          this.top = (Math.round(this.elmY / this.grid[1]) * this.grid[1])
        }
      }
    },

    handleUp: function (e) {
      if (e.type.indexOf('touch') !== -1) {
        this.lastMouseX = e.changedTouches[0].clientX

        this.lastMouseY = e.changedTouches[0].clientY
      }

      this.handle = null

      if (this.resizing) {
        this.resizing = false

        this.$emit('resizestop', this.left, this.top, this.width, this.height)
      }

      if (this.dragging) {
        this.dragging = false

        this.$emit('dragstop', this.left, this.top, this.indexpos)
      }

      this.elmX = this.left

      this.elmY = this.top
    }

  },

  computed: {

    style: function () {
      return {

        top: this.top + 'px',

        left: this.left + 'px',

        width: this.width + 'px',

        height: this.height + 'px',

        zIndex: this.zIndex

      }
    }

  },

  watch: {
    w: function (newW, oldW) {
      this.width = newW
      this.left = 0
    },
    x: function (newX, oldX) {
      this.left = 0
      this.elmX = 0
    },
    active: function (val) {
      this.enabled = val
    },

    z: function (val) {
      if (val >= 0 || val === 'auto') {
        this.zIndex = val
      }
    }

  }

}

</script>

<style scoped  lang="scss">
  span.help {
      margin-left: 0.3em;
      position: relative;

      .icon {
        display: inline-block;
        width: 16px;
        height: 14px;
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAA+UlEQVQ4ja3TS0oDQRAG4C8+lq7ceICICoLGK7iXuNBbeAMJuPVOIm7cqmDiIncIggg+cMZFaqCnZyYKWtB0df31V1VXdfNH6S2wD9CP8xT3KH8T9BiTcE7XBMOfyBcogvCFO9ziLWwFRosyV+QxthNsA9dJkEYlvazsQdi3sBv6Ol6TBLX+HWT3fcQZ3vGM5fBLk+ynAU41m1biCXvhs4OPBDuBpa6GxF0P8YAj3GA1d1qJfdoS4DOIcIm1DK9x8iaWeDF/SP3QU6zRROpjLDFLsFlibx1jJaMkSIGrWKntvItcyTBKzCcybsvc9ZmYz3kz9Ooz/b98A8yvW13B3ch6AAAAAElFTkSuQmCC');
        background-repeat: no-repeat;
        background-position: center center;

      } // .icon

      .helpText {
        background-color: #444;
        bottom: 30px;
        color: #fff;
        display: block;
        left: 0px;
        //margin-bottom: 15px;
        opacity: 0;
        padding: 20px;
        pointer-events: none;
        position: absolute;
        text-align: justify;
        width: 300px;
        //transform: translateY(10%);
        transition: all .25s ease-out;
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);
        border-radius: 6px;

        a {
          font-weight: bold;
          text-decoration: underline;
        } // a

      } // .helpText

      /* This bridges the gap so you can mouse into the tooltip without it disappearing */
      .helpText:before {
        bottom: -20px;
        content: " ";
        display: block;
        height: 20px;
        left: 0;
        position: absolute;
        width: 100%;
      }

      &:hover .helpText {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0px);
      }

    } // span.help

  .vdr {

    position: absolute;

    box-sizing: border-box;

  }

  .handle {

    box-sizing: border-box;

    display: none;

    position: absolute;

    width: 10px;

    height: 10px;

    font-size: 1px;

    background: #EEE;

    border: 1px solid #333;

  }

  .handle-tl {

    top: -10px;

    left: -10px;

    cursor: nw-resize;

  }

  .handle-tm {

    top: -10px;

    left: 50%;

    margin-left: -5px;

    cursor: n-resize;

  }

  .handle-tr {

    top: -10px;

    right: -10px;

    cursor: ne-resize;

  }

  .handle-ml {

    top: 50%;

    margin-top: -5px;

    left: -10px;

    cursor: w-resize;

  }

  .handle-mr {

    top: 50%;

    margin-top: -5px;

    right: -10px;

    cursor: e-resize;

  }

  .handle-bl {

    bottom: -10px;

    left: -10px;

    cursor: sw-resize;

  }

  .handle-bm {

    bottom: -10px;

    left: 50%;

    margin-left: -5px;

    cursor: s-resize;

  }

  .handle-br {

    bottom: -10px;

    right: -10px;

    cursor: se-resize;

  }

  @media only screen and (max-width: 768px) {

    /* For mobile phones: */

    [class*="handle-"]:before {

      content: '';

      left: -10px;

      right: -10px;

      bottom: -10px;

      top: -10px;

      position: absolute;

    }

  }

</style>
