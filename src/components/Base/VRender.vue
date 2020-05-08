<script>
  import VModal from './VModal'

  export default {
    name: 'VRender',
    components: {
      VModal
    },
    props: {
      activeModal: {
        type: Object,
      }
    },
    methods: {
      vNodeFromObject(nodeObject, render) {
        const nodes = []
        Object.keys(nodeObject).forEach(it => {
          if (nodeObject[it]) {
            nodeObject[it].forEach(it => nodes.push(this.createElement(it, render)))
          }
        })
        return nodes
      },

      extractAndCreate(obj, render) {
        const { element, slot, attrs, on, nativeOn, props, children } = obj
        return render(element, { slot, attrs, nativeOn, on, props }, this.createElement(children, render))
      },

      createElement(el, render) {
        const elements = []
        if (el && typeof el !== 'string') {
          if (!Array.isArray(el)) {
            elements.push(this.extractAndCreate(el, render))
          } else {
            el.forEach(it => {
              elements.push(this.extractAndCreate(it, render))
            })
          }
          return elements
        }
        return el
      }
    },

    render(h) {
      return h('div', { class: 'modal-wrap' }, [
        h(VModal, (() => this.vNodeFromObject(this.activeModal, h))())
      ])
    }
  }
</script>

<style lang="scss" scoped>
  .modal-wrap {
    @include flexAlign(center, center);
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .4);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
  }

  .modal {
    width: 500px;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: $boxShadow;

    &__header {
      @include fontNun($white, 1.2em);
      text-align: center;
      padding: 15px;
      background: $blue;
    }

    &__body {
      background: $white;
      padding: 15px;

      &-block {
        margin: 20px 0;
      }
    }

    &__footer {
      padding: 15px;
      background: $white;
    }
  }
</style>
