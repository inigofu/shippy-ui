<template>
  <div class="application-frame easing">
    <div class="panels-wrapper">
      <div class="navigator easing">
        <div v-bind:class="['preview' , 'xs' , 'easing' ,preview==='xs' ? 'active' : '']" v-on:click= "selectPreview('xs')">
          <div class="title-bar">
            <div class="size-icon"><i class="icon-mobile-phone"> </i></div>
            <div class="title">Phone</div>
          </div>
          <div class="preview-container">
            <div  class="preview-rows" style="width: 50.4px;">
              <div  v-for="(group,index) in grid.groups" :key="index" class="preview-row">
                <div v-for="(col,indexcol) in group.fields" :key="indexcol" class="preview-col">
                  <div class="preview-col-offset" v-bind:style = "{width : preview_xsoffset(col) + 'px'}"></div>
                  <div class="preview-col-width" v-bind:style = "{width : preview_xs(col) + 'px'}"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-bind:class="['preview' , 'sm' , 'easing' ,preview==='sm' ? 'active' : '']" v-on:click= "selectPreview('sm')">
          <div class="title-bar">
            <div class="size-icon"><i class="icon-tablet"> </i></div>
            <div class="title">Tablet</div>
          </div>
          <div class="preview-container">
            <div  class="preview-rows" style="width: 79.2px;">
              <div  v-for="(group,index) in grid.groups" :key="index" class="preview-row">
                <div v-for="(col,indexcol) in group.fields" :key="indexcol" class="preview-col">
                  <div class="preview-col-offset" v-bind:style = "{width : preview_smoffset(col) + 'px'}"></div>
                  <div class="preview-col-width" v-bind:style = "{width : preview_sm(col) + 'px'}"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-bind:class="['preview' , 'md' , 'easing' ,preview==='md' ? 'active' : '']" v-on:click= "selectPreview('md')">
          <div class="title-bar">
            <div class="size-icon"><i class="icon-laptop"> </i></div>
            <div class="title">Desktop</div>
          </div>
          <div class="preview-container">
            <div  class="preview-rows" style="width: 115.2px;">
              <div  v-for="(group,index) in grid.groups" :key="index" class="preview-row">
                <div v-for="(col,indexcol) in group.fields" :key="indexcol" class="preview-col">
                  <div class="preview-col-offset" v-bind:style = "{width : preview_mdoffset(col) + 'px'}"></div>
                  <div class="preview-col-width" v-bind:style = "{width : preview_md(col) + 'px'}"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-bind:class="['preview' , 'lg' , 'easing' ,preview==='lg' ? 'active' : '']" v-on:click= "selectPreview('lg')">
          <div class="title-bar">
            <div class="size-icon"><i class="icon-desktop">  </i></div>
            <div class="title">Large Desktop</div>
          </div>
          <div class="preview-container">
            <div  class="preview-rows" style="width: 144px;">
              <div  v-for="(group,index) in grid.groups" :key="index" class="preview-row">
                <div v-for="(col,indexcol) in group.fields" :key="indexcol" class="preview-col">
                  <div class="preview-col-offset" v-bind:style = "{width : preview_lgoffset(col) + 'px'}"></div>
                  <div class="preview-col-width" v-bind:style = "{width : preview_lg(col)+ 'px'}"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="workspace easing output-collapsed">
        <div v-bind:class = "['sl-container', preview ]">
          <div class="columns">
            <div class="columna"></div>
            <div class="columna"></div>
            <div class="columna"></div>
            <div class="columna"></div>
            <div class="columna"></div>
            <div class="columna"></div>
            <div class="columna"></div>
            <div class="columna"></div>
            <div class="columna"></div>
            <div class="columna"></div>
            <div class="columna"></div>
            <div class="columna"></div>
          </div>
          <div class="rows">
            <div v-for="(group,index) in grid.groups" :key="index" class="sl-row easing" id = "row-">
              <draggable class="cols" element="div" v-model="group.fields" :options="dragOptions" :move="onMove" @start="drag=false" @end="onEndDrag">

                  <resize-observer v-for="(col,indexcol) in group.fields" :key="indexcol" :preview="preview" :grid="[77,77]" :w="col.width" :x="col.offset" v-model="group.fields[indexcol]" :field="col" class="columna dragging" id="col-3" @resizing="onChange">

                  </resize-observer>

              </draggable>
              <input class="row-name" placeholder="Name Row">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ResizeObserver from './resizeobserver'

import draggable from 'vuedraggable'

export default {
  name: 'griddesigner',
  props: {
    schema: Object,
    tag: {
      type: String,
      default: 'fieldset',
      validator: function (value) {
        return value.length > 0
      }
    }
  },
  data () {
    return {
      editable: true,
      isDragging: false,
      delayedDragging: false,
      list: [],
      grid: Object,
      msg: 'Welcome to Your Vue.js App',
      preview: 'md'
    }
  },
  watch: {
    schema () {
      this.gridUpdate()
    }
  },
  mounted () {
    this.gridUpdate()
    this.selectPreview('md')
  },
  computed: {
    dragOptions () {
      return {
        animation: 0,
        group: 'description',
        disabled: !this.editable,
        ghostClass: 'ghost'
      }
    }
  },
  components: {
    ResizeObserver,
    draggable
  },
  methods: {
    gridUpdate () {
      if (this.schema.groups === undefined) {
        this.grid = {
          groups: [],
          name: null,
          id: null
        }
        this.grid.groups = [{legend: 'New row',
          fields: this.schema.fields}]
        let key
        for (key in this.schema) {
          if (key !== 'fields') {
            this.grid[key] = this.schema[key]
          }
        }
      } else {
        this.grid = this.schema
      }
    },
    onChange () {
      this.$emit('input', this.grid)
    },
    onEndDrag (evnt) {
      let previewcol = {}
      previewcol.groups = []
      for (let i = 0; i < this.grid.groups.length; i++) {
        if (this.grid.groups[i].fields !== undefined) {
          previewcol.groups.push({fields: this.grid.groups[i].fields.map(function (obj, index, array) {
            let tempobj = {
              xs: obj.xs,
              sm: obj.sm,
              md: obj.md,
              lg: obj.lg,
              xs_offset: obj.xs_offset,
              sm_offset: obj.sm_offset,
              md_offset: obj.md_offset,
              lg_offset: obj.lg_offset
            }
            let key
            for (key in obj) {
              if (key !== 'width' && key !== 'offset' && key !== 'xs' && key !== 'sm' && key !== 'md' && key !== 'lg' && key !== 'xs_offset' && key !== 'sm_offset' && key !== 'md_offset' && key !== 'lg_offset') {
                tempobj[key] = obj[key]
              }
            }
            return tempobj
          }, this)})
        }
      }
      let key
      for (key in this.grid) {
        if (key !== 'groups') {
          previewcol[key] = this.grid[key]
        }
      }
      this.grid = previewcol
    },
    onMove ({relatedContext, draggedContext}) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
    },
    preview_xs (col) {
      if (col.xs !== null | col.xs_offset === undefined) {
        return 47.4
      } else {
        return 38 / 12 * col.xs
      }
    },
    preview_xsoffset (col) {
      if (col.xs_offset === null | col.xs_offset === undefined) {
        return 0
      } else {
        return 38 / 12 * col.xs_offset
      }
    },
    preview_sm (col) {
      if (col.sm !== null && col.sm !== undefined) {
        return 60 / 12 * col.sm
      } else if (col.xs !== null && col.xs !== undefined) {
        return 60 / 12 * col.xs
      } else {
        return 60
      }
    },
    preview_smoffset (col) {
      if (col.sm_offset !== null && col.sm_offset !== undefined) {
        return 60 / 12 * col.sm_offset
      } else if (col.xs_offset !== null && col.xs_offset !== undefined) {
        return 60 / 12 * col.xs_offset
      } else {
        return 0
      }
    },
    preview_md (col) {
      if (col.md !== null && col.md !== undefined) {
        return 8 * col.md - 3
      } else if (col.sm !== null && col.sm !== undefined) {
        return 8 * col.sm - 3
      } else if (col.xs !== null && col.xs !== undefined) {
        return 8 * col.xs - 3
      } else {
        return 104
      }
    },
    preview_mdoffset (col) {
      if (col.md_offset !== null && col.md_offset !== undefined) {
        return 8 * col.md_offset
      } else if (col.sm_offset !== null && col.sm_offset !== undefined) {
        return 8 * col.sm_offset
      } else if (col.xs_offset !== null && col.xs_offset !== undefined) {
        return 8 * col.xs_offset
      } else {
        return 0
      }
    },
    preview_lg (col) {
      if (col.lg !== null && col.lg !== undefined) {
        return 10 * col.lg - 3
      } else if (col.md !== null && col.md !== undefined) {
        return 10 * col.md - 3
      } else if (col.sm !== null && col.sm !== undefined) {
        return 10 * col.sm - 3
      } else if (col.xs !== null && col.xs !== undefined) {
        return 10 * col.xs - 3
      } else {
        return 130
      }
    },
    preview_lgoffset (col) {
      if (col.lg_offset !== null && col.lg_offset !== undefined) {
        return 10 * col.lg_offset
      } else if (col.md_offset !== null && col.md_offset !== undefined) {
        return 10 * col.md_offset
      } else if (col.sm_offset !== null && col.sm_offset !== undefined) {
        return 10 * col.sm_offset
      } else if (col.xs_offset !== null && col.xs_offset !== undefined) {
        return 10 * col.xs_offset
      } else {
        return 0
      }
    },
    selectPreview (option) {
      this.preview = option
      let i = 0
      let previewcol = {}
      previewcol.groups = []
      for (i = 0; i < this.grid.groups.length; i++) {
        previewcol.groups.push({fields: this.grid.groups[i].fields.map(function (obj, index, array) {
          let width = 924
          let offset = 0
          switch (this.preview) {
            case 'xs':
              if (obj.xs !== null && obj.xs !== undefined) {
                width = 77 * obj.xs
              }
              if (obj.xs_offset !== null && obj.xs_offset !== undefined) {
                offset = 77 * obj.xs_offset
              }
              break
            case 'sm':
              if (obj.sm !== null && obj.sm !== undefined) {
                width = 77 * obj.sm
              } else if (obj.xs !== null && obj.xs !== undefined) {
                width = 77 * obj.xs
              }
              if (obj.sm_offset !== null && obj.sm_offset !== undefined) {
                offset = 77 * obj.sm_offset
              } else if (obj.xs_offset !== null && obj.xs_offset !== undefined) {
                offset = 77 * obj.xs_offset
              }
              break
            case 'md':
              if (obj.md !== null && obj.md !== undefined) {
                width = 77 * obj.md
              } else if (obj.sm !== null && obj.sm !== undefined) {
                width = 77 * obj.sm
              } else if (obj.xs !== null && obj.xs !== undefined) {
                width = 77 * obj.xs
              }
              if (obj.md_offset !== null && obj.md_offset !== undefined) {
                offset = 77 * obj.md_offset
              } else if (obj.sm_offset !== null && obj.sm_offset !== undefined) {
                offset = 77 * obj.sm_offset
              } else if (obj.xs_offset !== null && obj.xs_offset !== undefined) {
                offset = 77 * obj.xs_offset
              }
              break
            case 'lg':
              if (obj.lg !== null && obj.lg !== undefined) {
                width = 77 * obj.lg
              } else if (obj.md !== null && obj.md !== undefined) {
                width = 77 * obj.md
              } else if (obj.sm !== null && obj.sm !== undefined) {
                width = 77 * obj.sm
              } else if (obj.xs !== null && obj.xs !== undefined) {
                width = 77 * obj.xs
              }
              if (obj.lg_offset !== null && obj.lg_offset !== undefined) {
                offset = 77 * obj.lg_offset
              } else if (obj.md_offset !== null && obj.md_offset !== undefined) {
                offset = 77 * obj.md_offset
              } else if (obj.sm_offset !== null && obj.sm_offset !== undefined) {
                offset = 77 * obj.sm_offset
              } else if (obj.xs_offset !== null && obj.xs_offset !== undefined) {
                offset = 77 * obj.xs_offset
              }
              break
          }
          let offsetcount = 0
          let widthcount = 0
          if (offset > 0) { offsetcount = 1 }
          if (width > 0) { widthcount = 1 }
          width = width - (15 / (offsetcount + widthcount))
          offset = offset - (15 / (offsetcount + widthcount))
          let tempobj = {
            width: width,
            offset: offset,
            xs: obj.xs,
            sm: obj.sm,
            md: obj.md,
            lg: obj.lg,
            xs_offset: obj.xs_offset,
            sm_offset: obj.sm_offset,
            md_offset: obj.md_offset,
            lg_offset: obj.lg_offset
          }
          let key
          for (key in obj) {
            if (key !== 'width' && key !== 'offset' && key !== 'xs' && key !== 'sm' && key !== 'md' && key !== 'lg' && key !== 'xs_offset' && key !== 'sm_offset' && key !== 'md_offset' && key !== 'lg_offset') {
              tempobj[key] = obj[key]
            }
          }
          return tempobj
        }, this)})
      }
      let key
      for (key in this.grid) {
        if (key !== 'groups') {
          previewcol[key] = this.grid[key]
        }
      }
      this.grid = previewcol
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

/* EXTRAS
 * -------------------------- */
/* Stacked and layered icon */
.icon-stack {
  position: relative;
  display: inline-block;
  width: 2em;
  height: 2em;
  line-height: 2em;
  vertical-align: -35%;
}
.icon-stack [class^="icon-"],
.icon-stack [class*=" icon-"] {
  display: block;
  text-align: center;
  position: absolute;
  width: 100%;
  height: 100%;
  font-size: 1em;
  line-height: inherit;
  *line-height: 2em;
}
.icon-stack .icon-stack-base {
  font-size: 2em;
  *line-height: 1em;
}
/* Animated rotating icon */
.icon-spin {
  display: inline-block;
  -moz-animation: spin 2s infinite linear;
  -o-animation: spin 2s infinite linear;
  -webkit-animation: spin 2s infinite linear;
  animation: spin 2s infinite linear;
}
a .icon-spin {
  display: inline-block;
  text-decoration: none;
}
@-moz-keyframes spin {
  0% {
    -moz-transform: rotate(0deg);
  }
  100% {
    -moz-transform: rotate(359deg);
  }
}
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(359deg);
  }
}
@-o-keyframes spin {
  0% {
    -o-transform: rotate(0deg);
  }
  100% {
    -o-transform: rotate(359deg);
  }
}
@-ms-keyframes spin {
  0% {
    -ms-transform: rotate(0deg);
  }
  100% {
    -ms-transform: rotate(359deg);
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}

::selection,
-moz::selection {
  background: #0a91ff;
  color: #ffffff;
}
.application-frame {
  height: 100%;
  width: 100%;
  min-width: 1170px;
  min-height: 600px;
  position: relative;
  overflow-y: hidden;
  border-top: 5px solid rgba(255, 255, 255, 0);
}
.application-frame.preview-mode {
  height: 0;
  min-height: 0;
}
.panels-wrapper {
  position: absolute;
  height: 100%;
  left: 0px;
  right: 0px;
}
img {
  max-width: 100%;
  height: auto;
}
input {
  outline: none;
}
.easing {
  transition: width 0.5s, margin 0.5s, height 0.5s, top 0.5s, left 0.5s, right 0.5s, background 0.5s, opacity 0.5s, font-size 0.3s;
  -webkit-transition: width 0.5s, margin 0.5s, height 0.5s, top 0.5s, left 0.5s, right 0.5s, background 0.5s, opacity 0.5s, font-size 0.3s;
}
.no-changes {
  background-image: -webkit-gradient(linear, 0 100%, 100% 0, color-stop(0.25, rgba(255, 255, 255, 0.15)), color-stop(0.25, transparent), color-stop(0.5, transparent), color-stop(0.5, rgba(255, 255, 255, 0.15)), color-stop(0.72, rgba(255, 255, 255, 0.15)), color-stop(0.72, transparent), to(transparent));
  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 72%, transparent 72%, transparent);
  background-image: -moz-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 72%, transparent 72%, transparent);
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 72%, transparent 72%, transparent);
  background-size: 20px 20px;
}
.blackout-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
}
.blackout-overlay .notification {
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
  width: 200px;
  color: #ffffff;
  font-size: 22px;
  font-weight: 600;
}
.home {
  background-color: #5b9bfb;
  padding-top: 80px;
  color: #ffffff;
  font-size: 18px;
}
.main-logo {
  text-align: center;
}
.start {
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  font-size: 30px;
  color: #ffffff;
  padding: 15px 30px;
}
.features {
  background-color: #262626;
  padding: 50px 0px;
  background-position: top center;
  background-repeat: repeat-y;
  -webkit-box-shadow: inset 0px 0px 30px #000000;
  box-shadow: inset 0px 0px 30px #000000;
}

.navigator {
  width: 176px;
  position: absolute !important;
  left: 0px;
  top: 0px;
  bottom: 5px;
  white-space: nowrap;
  z-index: 1;
  background-color: #2b2b2b;
  border-right: 5px solid #292929;
}
.navigator .preview {
  background-image: -webkit-gradient(radial, center center, 0, center center, 460, from(#292929), to(#1c1c1c));
  background-image: -webkit-radial-gradient(circle, #292929, #1c1c1c);
  background-image: -moz-radial-gradient(circle, #292929, #1c1c1c);
  background-image: radial-gradient(circle, #292929, #1c1c1c);
  background-repeat: no-repeat;
  cursor: pointer;
  height: 25%;
  position: relative;
}
.navigator .preview:hover {
  background-color: #243a47;
  background-image: -webkit-gradient(radial, center center, 0, center center, 460, from(#1b2c36), to(#0f191f));
  background-image: -webkit-radial-gradient(circle, #1b2c36, #0f191f);
  background-image: -moz-radial-gradient(circle, #1b2c36, #0f191f);
  background-image: radial-gradient(circle, #1b2c36, #0f191f);
  background-repeat: no-repeat;
}
.navigator .preview:hover .title-bar {
  color: #ffffff;
}
.navigator .preview.active {
  background-color: #243a47;
  background-image: -webkit-gradient(radial, center center, 0, center center, 460, from(#243a47), to(#1a2a33));
  background-image: -webkit-radial-gradient(circle, #243a47, #1a2a33);
  background-image: -moz-radial-gradient(circle, #243a47, #1a2a33);
  background-image: radial-gradient(circle, #243a47, #1a2a33);
  background-repeat: no-repeat;
}
.navigator .preview.active .title-bar {
  color: #ffffff;
  background-image: -webkit-gradient(linear, left 0%, left 100%, from(#276b96), to(#0a598a));
  background-image: -webkit-linear-gradient(top, #276b96, 0%, #0a598a, 100%);
  background-image: -moz-linear-gradient(top, #276b96 0%, #0a598a 100%);
  background-image: linear-gradient(to bottom, #276b96 0%, #0a598a 100%);
  background-repeat: repeat-x;
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff276b96', endColorstr='#ff0a598a', GradientType=0);
}
.navigator .preview .title-bar {
  border-bottom: 2px solid #303436;
  color: #cccccc;
  font-size: 18px;
  padding: 5px 0px 5px 10px;
  font-weight: 600;
  font-family: "proxima-nova-alt-condensed", "Helvetica Neue", Helvetica, Arial, sans-serif;
  background-image: -webkit-gradient(linear, left 0%, left 100%, from(#1b1d1d), to(#151313));
  background-image: -webkit-linear-gradient(top, #1b1d1d, 0%, #151313, 100%);
  background-image: -moz-linear-gradient(top, #1b1d1d 0%, #151313 100%);
  background-image: linear-gradient(to bottom, #1b1d1d 0%, #151313 100%);
  background-repeat: repeat-x;
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff1b1d1d', endColorstr='#ff151313', GradientType=0);
}
.navigator .preview .title-bar:before,
.navigator .preview .title-bar:after {
  content: " ";
  /* 1 */

  display: table;
  /* 2 */

}
.navigator .preview .title-bar:after {
  clear: both;
}
.navigator .preview .title-bar:before,
.navigator .preview .title-bar:after {
  content: " ";
  /* 1 */

  display: table;
  /* 2 */

}
.navigator .preview .title-bar:after {
  clear: both;
}
.navigator .preview .size-icon {
  float: right;
  text-align: center;
  width: 30px;
}
.navigator .preview .size-icon i {
  font-size: 20px;
  line-height: 10px;
}
.navigator .preview .title {
  float: left;
}
.navigator.collapsed {
  margin-left: -180px;
}
.navigator.collapsed .preview {
  height: 30px;
}
.navigator .preview-container {
  position: absolute;
  overflow: auto;
  top: 37px;
  left: 0;
  right: 0;
  bottom: 0;
}
.navigator .preview-container .preview-rows {
  padding-top: 8px;
  margin-left: auto;
  margin-right: auto;
  overflow: auto;
}
.navigator .preview-container .preview-rows .preview-row {
  overflow: hidden;
  clear: both;
}
.navigator .preview-container .preview-rows .preview-col {
  float: left;
  height: 20px;
  display: inline-block;
  margin-right: 3px;
  margin-bottom: 3px;
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}
.navigator .preview-container .preview-rows .preview-col:last-child {
  margin-right: 0;
  margin-bottom: 0;
}
.navigator .preview-container .preview-rows .preview-col .preview-col-offset,
.navigator .preview-container .preview-rows .preview-col .preview-col-width {
  display: inline-block;
  height: 20px;
}
.navigator .preview-container .preview-rows .preview-col .preview-col-offset {
  background: rgba(0, 0, 0, 0.5);
}
.navigator .preview-rows .preview-row {
  margin-bottom: 3px;
}
.navigator .xs .preview-col {
  background: #c72818;
}
.navigator .sm .preview-col {
  background: #1583df;
}
.navigator .md .preview-col {
  background: #1da83f;
}
.navigator .lg .preview-col {
  background: #c6861a;
}
.workspace {
  position: absolute;
  top: 0px;
  bottom: 5px;
  right: 420px;
  left: 176px;
  overflow-y: scroll;
  background-color: #ffffff;
  overflow-y:auto;
}
.workspace.medias-collapsed {
  left: 50px;
}
.workspace.output-collapsed {
  right: 0px;
}
.workspace .columns {
  height: 100%;
  position: absolute;
  left: 15px;
  top: 0;
}
.workspace .columns .columna {
  width: 62px;
  height: 100%;
  margin-right: 15px;
  background-color: #d6d3d3;
}
.row .columna {
  width: auto;
  cursor: pointer;
  background: transparent;
}
.rows {
  min-width: 935px;
  position: absolute;
  left: 0;
  top: 0;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.rows .sl-row {
  padding-top: 25px;
  padding-left: 15px;
  width: 100%;
  background: rgba(89, 156, 255, 0.3);
  margin-top: 10px;
  position: relative;
  min-height: 185px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  display: inline-block
}
.rows .sl-row.active {
  background: rgba(89, 156, 255, 0.5);
}
.rows .sl-row.active .new-col {
  display: inline-block;
}
.rows .sl-row.removing {
  opacity: 0;
}
.rows .sl-row .row-name {
  position: absolute;
  left: 0;
  top: 0;
  border: 0;
  padding: 0;
  background: transparent;
  font-family: inherit;
  font-size: 10pt;
  font-weight: 600;
  color: white;
  padding-left: 5px;
  width: 285px;
}
.rows .sl-row .tools {
  position: absolute;
  top: 0px;
  right: 5px;
  color: rgba(255, 255, 255, 0.6);
}
.rows .sl-row .tools i:hover {
  color: #ffffff;
}
.rows .sl-row .tools .grow-row.active {
  color: white;
}
.rows .sl-row .tools span {
  display: inline-block;
  padding-left: 10px;
  cursor: pointer;
}
.rows .sl-row .clear {
  clear: both;
}
.rows .new-row {
  width: 872px;
  height: 150px;
  margin-left: 20px;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  background: transparent !important;
  cursor: pointer;
}
.rows ::-webkit-input-placeholder {
  /* WebKit browsers */

  color: rgba(255, 255, 255, 0.4);
}
.rows :-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */

  color: rgba(255, 255, 255, 0.4);
}
.rows ::-moz-placeholder {
  /* Mozilla Firefox 19+ */

  color: rgba(255, 255, 255, 0.4);
}
.rows :-ms-input-placeholder {
  /* Internet Explorer 10+ */

  color: rgba(255, 255, 255, 0.4);
}
.sl-container {
  width: 975px;
  overflow: hidden;
  position: relative;
  height: 100%;
  overflow-y:auto;
  margin: 0 auto;
}
.sl-container.xs .sl-row {
  background: rgba(224, 82, 82, 0.25);
}
.sl-container.xs .sl-row.active {
  background: rgba(224, 82, 82, 0.30000000000000004);
}
.sl-container.xs .columna .width {
  background-color: #e05252;
}
.sl-container.xs .columna .width .col-name {
  left: 7px;
}
.sl-container.xs .columna .width .classes {
  left: 7px;
}
.sl-container.xs .offset-handle {
  display: none;
}
.sl-container.sm .sl-row {
  background: rgba(90, 155, 252, 0.25);
}
.sl-container.sm .sl-row.active {
  background: rgba(90, 155, 252, 0.30000000000000004);
}
.sl-container.sm .columna .width {
  background-color: #5a9bfc;
}
.sl-container.md .sl-row {
  background: rgba(87, 162, 100, 0.25);
}
.sl-container.md .sl-row.active {
  background: rgba(87, 162, 100, 0.30000000000000004);
}
.sl-container.md .columna .width {
  background-color: #57a264;
}
.sl-container.lg .sl-row {
  background: rgba(209, 150, 61, 0.25);
}
.sl-container.lg .sl-row.active {
  background: rgba(209, 150, 61, 0.30000000000000004);
}
.sl-container.lg .columna .width {
  background-color: #d1963d;
}
.sl-container .columna {
  height: 150px;
  background: #ccc;
  font-weight: 600;
  float: left;
  position: relative;
  margin-right: 15px;
  margin-bottom: 10px;
  background: transparent;
  resize: horizontal
}
.sl-container .columna:first-child {
  margin-left: 0;
}
.sl-container .columna:last-child {
  margin-right: 0;
}
.sl-container .columna .remove {
  display: block;
  position: absolute;
  top: 0px;
  right: 5px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}
.sl-container .columna .remove:hover {
  color: #ffffff;
}
.sl-container .columna .width {
  width: 60px;
  min-width: 60px;
  height: 100%;
  display: inline-block;
  position: relative;
  float: left;
  cursor: -webkit-grab !important;
  cursor: -moz-grab !important;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
}
.sl-container .columna .width:active {
  cursor: col-resize;
}
.sl-container .columna .width .offset-handle {
  position: absolute;
  left: 4px;
  top: 5px;
  bottom: 5px;
  background-color: rgba(0, 0, 0, 0.13);
  width: 8px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  cursor: -webkit-grab !important;
  cursor: -moz-grab !important;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.sl-container .columna .width .col-name {
  position: absolute;
  left: 15px;
  top: 0;
  font-size: 10pt;
  font-weight: 600;
  padding: 0;
  border: 0;
  color: white;
  padding-left: 2px;
  background: transparent;
}
.sl-container .columna .width .classes {
  position: absolute;
  bottom: 3px;
  left: 19px;
  font-size: 10pt;
  color: white;
  line-height: 1em;
}
.sl-container .columna .width .nested {
  position: absolute;
  bottom: 5px;
  right: 5px;
  line-height: 1em;
  font-size: 13pt;
  color: rgba(0, 0, 0, 0.3);
}
.sl-container .offset {
  height: 100%;
  display: inline-block;
  float: left;
  background-color: rgba(0, 0, 0, 0.1);
}
.sl-container .new-col {
  display: none;
  float: left;
  margin-bottom: 10px;
  width: 50px;
  cursor: pointer;
  margin-left: 5px;
  height: 150px;
  border: 1px dashed rgba(255, 255, 255, 0.5);
  background: transparent;
}
.sl-container .new-col.no-cols {
  margin-left: 5px;
}
.sl-container .new-col:first-child {
  margin-left: 4px;
}

.copy-output {
  position: absolute;
  width: 1px;
  height: 1px;
  bottom: -10px;
  visibility: hidden;
}
pre.prettyprint {
  background-color: transparent;
  font-family: Menlo, "Bitstream Vera Sans Mono", "DejaVu Sans Mono", Monaco, Consolas, monospace;
  font-size: 12px;
  line-height: 1.5;
  border: 1px solid #cccccc;
  padding: 10px;
  color: white;
}
.dec {
  color: white;
}
.opn {
  color: white;
}
.lit {
  color: #445588;
}
.atv {
  color: #86e9fd;
}
.kwd {
  color: #ff6600;
}
.tag {
  color: #ffa629;
}
.atn {
  color: #ffdd9e;
}
.clo {
  color: white;
}
.var {
  color: white;
}
.str {
  color: #66ff00;
}
.pln {
  color: #eedd9b;
}
.pun {
  color: white;
}
.fun {
  color: #ffcc00;
}
.typ {
  color: #445588;
}
.com {
  color: #9933cc;
}
ol.linenums {
  margin-top: 0;
  margin-bottom: 0;
}
.edn-name {
  float: left;
  margin-right: 0.5em;
}
ul.edn-rows {
  position: relative;
  margin: 0;
  padding: 0;
}
ul.edn-rows > li:first-child {
  margin-left: 0;
}
ul.edn-rows > li {
  margin-left: 0.6em;
}
.edn-kw {
  display: inline-block;
  margin-right: 0.5em;
  cursor: pointer;
}
ul.edn-media {
  position: relative;
  display: inline-block;
  padding: 0;
  margin: 0;
}
.edn-bracket-open {
  float: left;
}
.edn-kw.edn-width {
  margin-right: 0;
}
.edn-bracket-close {
  display: inline-block;
}
ul.edn-cols {
  position: relative;
  display: inline-block;
  padding: 0;
  margin: 0;
}
@font-face {
  font-family: 'BLOKKNeue-Regular';}
body.preview {
  color: #cccccc;
  background-color: #ffffff;
}
.preview-pane .container {
  width: auto;
  overflow: auto;
  position: inherit;
  min-height: inherit;
  height: auto;
}
.preview-pane {
  background: white;
  padding-top: 55px;
  height: 100%;
}
.preview-pane .wrap {
  min-height: 150px;
  position: relative;
}
.preview-pane .wrap .preview-tools {
  position: absolute;
  left: 0;
  top: 0;
}
.preview-pane .wrap .btn {
  font-family: helvetica;
}
.preview-pane .wrap .preview-text {
  transition: 0.2;
  min-height: 1.5em;
}
.preview-pane .wrap .preview-text:hover {
  background: #FFFDC8;
}
.preview-pane .wrap .preview-image {
  background: #ccc;
  height: 5em;
}
</style>
