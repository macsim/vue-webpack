<template>
  <div class="popin">
    <div class="popin-wrapper">
      <div class="popin-close" @click="onTogglePopin">
        close
        <span></span><span></span>
      </div>

      <header class="popin-header">
        <div class="popin-header-inner">
          <slot v-if="datas.header" name="header" :datas="datas.header">
            <h1 class="popin-header-title">{{datas.header.title}}</h1>
          </slot>
        </div>
      </header>

      <main class="popin-content">
        <div class="popin-content-inner">
          <div class="popin-content-scroll">
              <div class="popin-content-scroll-inner">
                <slot v-if="datas.content" name="content" :datas="datas.content">
                  <h2 class="popin-content-title">{{datas.content.title}}</h2>
                </slot>
            </div>
          </div>
        </div>
      </main>

      <footer class="popin-footer">
        <div class="popin-footer-inner">
          <slot v-if="datas.footer" name="footer" :datas="datas.footer">
            <h3 class="popin-footer-title">{{datas.footer.title}}</h3>
          </slot>
        </div>
      </footer>
    </div>
    <div class="popin-overlay" @click="onTogglePopin"></div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import VueResource from 'vue-resource';
  import DataLoader from '@/components/DataLoader';

  Vue.use(VueResource);

  export default {
    name: 'popin',
    props: ['header', 'content', 'footer'],
    extends: DataLoader,

    data () {
      return {
        datas: []
      }
    },

    created () {
      console.log('%Created Popin:', 'color: gray', this.dataJson);
    },

    methods: {
      onTogglePopin(e) {
        this.$parent.onTogglePopin(e);
      }
    }
  }
</script>
<style>
#app .popin-wrapper .image-wrapper {
  width: auto;
  max-width: 100%;
  height: auto;
}
#app .popin-wrapper .image{
  width: auto;
  max-width: 100%;
  display: inline-block;
  position: relative;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.popin,
.popin-wrapper,
.popin-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
}

.popin-wrapper {
  z-index: 1;
  width: auto;
  height: auto;
  width: 900px;
  height: 740px;
  background: white;
  left: 50%;
  top: 50%;
  right: auto;
  bottom: auto;
  transform: translateX(-50%) translateY(-50%);
  display: table;
}
.popin-overlay {
  background: black;
  opacity: 0.5;
  z-index: 0;
  cursor: pointer;
}

.popin-header,
.popin-content,
.popin-footer {
  display: table-row;
}

.popin-header-inner,
.popin-content-inner,
.popin-footer-inner {
  display: table-cell;
  vertical-align: middle;
  height: 40px;
  position: relative;
}

.popin-header {
  background: #EFEFEF;
}
.popin-content {
  height: 100%;
}
.popin-content-inner {
}
.popin-content-scroll {
  overflow: auto;
  width: 100%;
  height: 100%;
}
.popin-footer {
  background: #EFEFEF;
}

.popin-close {
  position: absolute;
  border: 1px solid black;
  top: 5px;
  right: 5px;
  font-size: 0;
  line-height: 0;
  width: 30px;
  height: 30px;
  z-index: 100;
  cursor: pointer;
  box-sizing: border-box;
}

.popin-close span {
  display: block;
  position: relative;
  width: 50%;
  height: 1px;
  margin-top: -1px;
  background: black;
  left: 50%;
  top: calc(50% + 1px);
  transform-origin: center center;
}

.popin-close span:nth-child(1) {
  transform: translateX(-50%) translateY(-50%) rotate(45deg);
}
.popin-close span:nth-child(2) {
  transform: translateX(-50%) translateY(-50%) rotate(-45deg);
}
</style>