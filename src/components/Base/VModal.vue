<template>
  <div class="modal-wrap" :style="{backgroundColor: backColor}">
    <transition name="slideInLeft">
      <div v-show="show" class="modal" :style="{backgroundColor: modalColor}">
        <div :class="['modal__header', type]">
          <div class="modal-close" @click="$emit('close')">
            <i class="material-icons modal-close-icon">close</i>
          </div>
          <slot name="header"></slot>
        </div>
        <div ref="body" :class="['modal__body', {'modal__body-scroll': bodyScroll}]">
          <slot name="body"></slot>
        </div>
        <div class="modal__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
	export default {
		name: 'VModal',
		props: {
			type: {
				type: String
			},

			backColor: {
				type: String
			},

      bodyScroll: {
				type: Boolean,
        default: false
      },

			modalColor: {
				type: String
			}
		},

		data() {
			return {
				show: false
			}
		},

		mounted() {
			setTimeout(() => this.show = true, 200)
		}
	}
</script>

<style lang="scss" scoped>
  .modal-wrap {
    @include flexAlign(center, center);
    width: 100vw;
    height: 100%;
    background: rgba(255, 255, 255, .9);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
  }

  .modal {
    width: 450px;
    max-width: 90%;
    box-shadow: $boxShadow;
    border-radius: 15px;
    background: $white;
    border-right: 5px;
    overflow: hidden;

    &__header {
      text-align: center;
      padding: 10px;
    }

    &__body {
      position: relative;
      max-height: 50vh;
      padding: 0 15px;

      &-scroll{
        overflow-y: auto;
      }
    }

    &__buttons-block {
      display: flex;
      justify-content: center;
    }

    &-close {
      @include flexAlign(center, center);
      position: absolute;
      top: 10px;
      right: 10px;
      width: 40px;
      height: 40px;

      &-icon {
        font-size: 30px !important;
        color: $white;
      }
    }
  }

  @media screen and (max-width: 540px) {
    .modal {
      width: 90%;
    }
  }
</style>
