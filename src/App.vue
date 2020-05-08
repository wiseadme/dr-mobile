<template>
  <div>
    <div ref="turn" id="turn" :class="['block-page', {turn: !isAuthPage}]">
      <div class="turn__content">
        <img class="turn__logo" :src="require('./assets/images/logo-native.svg')" alt="">
        <span class="turn__text">Demand Response Mobile</span>
        <span class="turn__text">доступен только с мобильных устройств</span>
        <span class="turn__text">и в портретном режиме</span>
      </div>
    </div>
    <div ref="app" id="app" :class="[{app: !isAuthPage}]">
      <DrBrand/>
      <Notify/>
      <div class="router-wrap router">
        <transition name="fadeIn">
          <router-view/>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import { lStorage } from '@/utils'
  import Notify from './services/Notifications/Notify'
  import DrBrand from '@/components/DrBrand'

  export default {
    name: 'App',

    components: {
      Notify,
      DrBrand
    },

    created() {
      this.$moment.lang('ru')
      let device = lStorage('device')
      let tokens = lStorage('tokens')
      let user = lStorage('user')
      tokens = tokens ? tokens : null
      if (!device) {
        this.setDevice(navigator.platform)
        lStorage('device', navigator.platform)
      } else {
        this.setDevice(device)
      }
      if (tokens) {
        this.setRestTokens(tokens)
        this.setUserInfo(user)
      }
    },

    mounted() {
    },

    methods: {
      ...mapActions({
        setRestTokens: `Auth/${ action.SET_REST_TOKENS }`
      }),
      ...mapMutations({
        setDevice: `Auth/${ mutation.SET_DEVICE }`,
        setUserInfo: `Auth/${ mutation.SET_USER_INFO }`
      })
    },

    computed: {
      isAuthPage() {
        return this.$route.path.includes('/auth')
      }
    }
  }
</script>

<style lang="scss">
  @import "assets/scss/main";

  #app {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .router-wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

</style>
