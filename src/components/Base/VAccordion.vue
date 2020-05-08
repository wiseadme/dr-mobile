<template>
  <div class="ac-wrap">
    <div class="accordeon" @click="isOpened = !isOpened">
      <div class="accordeon__header">
        <div :class="['icon-wrap', `${isOpened ? 'rotate-up' : 'rotate-down'}`]">
          <i class="icon chevron-down"></i>
        </div>
        <span class="accordeon__header-text">{{accordHeader}}</span>
      </div>
      <transition name="slideInDown">
        <div class="accordeon__items" v-show="isOpened">
          <span class="accordeon__items-element" v-for="it in accordItems" :key="it.name">{{it.name}}</span>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
	export default {
		name: 'ObAccordion',
		props: {
			accordHeader: {
				type: String
			},
			accordItems: {}
		},
		data () {
			return {
				isOpened: false
			}
		}
	}
</script>
<style lang="scss">
  $bgColor: #F2F7FD;
  $fontColor: #004BC8;

  .accordeon {
    width: 100%;
    height: auto;
    background: $bgColor;
    overflow: hidden;
    transition: all .1s linear;

    &__header {
      display: flex;
      align-items: center;
      padding: 10px;
      overflow: hidden;
      color: $fontColor;
      box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.2);
      position: relative;
      z-index: 10;

      &-text {
        margin: 0 10px;
      }
    }

    &__items {
      width: 100%;
      display: flex;
      flex-direction: column;
      transform-origin: top;
      background: $bgColor;
      position: relative;
      z-index: 8;
      transform-origin: top;
      box-shadow: inset 0px -2px 12px 1px rgba(0, 0, 0, 0.2);

      &-element {
        padding: 10px;
        font-family: Roboto;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
      }
    }
  }

  .icon-wrap {
    transition: all .1s linear;
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 2px;
  }

  .icon {
    color: $fontColor;
  }

  .rotate-up {
    transform: rotate(180deg) !important;
  }

  .rotate-down {
    transform: rotate(0);
  }

  .slideInDown-enter, .slideInDown-leave-to {
    opacity: 0;
    transform: scaleY(0);
  }

  .slideInDown-enter-active, .slideInDown-leave-active {
    transition: all .1s linear;
  }
</style>
