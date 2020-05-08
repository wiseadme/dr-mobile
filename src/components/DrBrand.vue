<template>
  <div
    v-show="!$route.path.includes('/auth')"
    :class="['dr-brand', {show}]"
    @touchmove="closeInfo"
  >
    <img class="dr-brand__logo" src="../assets/images/logo-white.svg" alt="">
    <div class="dr-brand__text">
      <span class="dr-brand__text-item">Demand Response Mobile</span>
      <span class="dr-brand__text-item">&copy; АО "НТЦ ЕЭС Информационные комплексы" 2020 г.</span>
    </div>
    <div
      @touchstart="toggleShow"
      @click="toggleShow"
      class="dr-brand__name"
    >Demand Response</div>
  </div>
</template>

<script>
	export default {
		data() {
			return {
				show: false
			}
		},
		methods: {
			toggleShow() {
				this.show = !this.show
			},

			closeInfo() {
				if (!this.show) return
				this.show = !this.show
			}
		}
	}
</script>

<style lang="scss">
  .dr-brand {
    @include flexAlign(center, center);
    width: 200px;
    height: 200px;
    background: $classicBlue;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    position: fixed;
    top: calc(50% - 100px);
    transform: translateX(-100%);
    z-index: 9998;
    box-shadow: $boxShadow;
    transition: transform .2s linear;

    &__text {
      @include fontNun($white, 12px);
      @include flexAlign(center, center, column);
      position: absolute;
      width: 90%;
      text-align: center;
      &-item {
        &:nth-child(1) {
          font-weight: 800;
          font-size: 14px;
          padding: 10px 0;
        }
        &:nth-child(2) {
          font-size: 11px;
        }
      }
    }

    &__name {
      @include fontNun($white, 10px);
      flex: 0 0 96px;
      width: 96px;
      padding: 5px;
      background: $classicBlue;
      transform: rotate(-90deg);
      border-bottom-right-radius: 5px;
      border-bottom-left-radius: 5px;
      position: absolute;
      left: calc(100% - 39px);
      cursor: pointer;
    }

    &__logo {
      position: absolute;
      width: 90%;
      opacity: .2;
    }
  }

  .show {
    transform: translateX(0);
  }

</style>
