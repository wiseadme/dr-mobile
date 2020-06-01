<template>
  <div :class="['auth-page', {'flex-start': isRegistration}]">
    <transition name="fadeIn">
      <DrForm
        v-if="show"
        :disabled="showCaptcha && !isCaptchaValid"
        :isRegistration="isRegistration"
        :isPasswordChange="isPasswordChange"
        @login="sendLoginParams"
        @registration="createNewUser"
        @password="sendEmailForPassword"
      />
    </transition>
    <v-modal
      v-if="showCaptcha"
      modal-color="#063B87"
      :close-btn="false"
    >
      <img
        class="modal-logo"
        slot="header"
        :src="require('../assets/images/logo-white.svg')"
      >
      <div class="modal-header-wrap" slot="header">
        <h1 class="modal-header">Подтвердите свои действия</h1>
      </div>
      <div class="captcha" slot="body">
        <div class="captcha__content">
          <img :src="`/api/v1/auth/captcha?${timestamp}`" class="captcha__task">
        </div>
        <div class="captcha__code">
          <v-input
            label="введите код с картинки"
            color="#ffffff"
            v-model="captcha"
          />
        </div>
        <div class="captcha__btn">
          <v-button @click="checkCaptchaCode" text="подтвердить" type="warning"/>
        </div>
      </div>
    </v-modal>
  </div>
</template>

<script>
  import DrForm from '@/components/DrForm'
  import { lStorage } from '@/utils'
  import { deleteCookie } from '../utils'

  export default {
    name: 'index',
    components: {
      DrForm
    },

    data() {
      return {
        show: false,
        email: '',
        linkId: '',
        showCaptcha: false,
        captchaImg: null,
        captcha: '',
        isCaptchaValid: false,
        timestamp: ''
      }
    },

    created() {
      this.timestamp = new Date().getTime()
      if (lStorage('tokens')) {
        this.$router.replace('/cabinet')
      }
      if (this.isRegistration && this.$route.query.email) {
        this.email = this.$route.query.email
        this.linkId = this.$route.query.link_id
        this.checkUniqId({ email: this.email, id: this.linkId })
      }
    },

    methods: {
      ...mapActions({
        loginUser: `Auth/${ action.LOGIN_USER }`,
        checkUniqId: `Auth/${ action.CHECK_UNIQ_ID }`,
        createUser: `Auth/${ action.CREATE_USER }`,
        changePassword: `Auth/${ action.CHANGE_PASSWORD }`,
        checkCaptcha: `Auth/${ action.CHECK_CAPTCHA }`
      }),

      checkCaptchaCode() {
        deleteCookie('captcha')
        document.cookie = document.cookie + `captcha=${ this.captcha }`
        this.checkCaptcha()
          .then(() => {
            this.isCaptchaValid = true
            this.showCaptcha = false
            this.timestamp = new Date().getTime()
          })
          .catch(() => {
            this.captcha = ''
            this.showCaptcha = false
            this.timestamp = new Date().getTime()
            setTimeout(() => this.showCaptcha = true, 0)
          })
      },

      sendLoginParams($event) {
        this.loginUser($event)
          .then(res => {
            this.setStorageItems(res)
            this.$router.replace('/cabinet')
          })
          .catch(err => {
            if (err.response.data.hasCaptcha) {
              this.tryCaptcha()
            }
            this.$notify({
              type: 'danger',
              message: err.response.data.message || err
            })
          })
      },

      tryCaptcha() {
        this.captcha = ''
        this.showCaptcha = true
      },

      createNewUser($event) {
        this.createUser($event)
          .then(res => {
            this.setStorageItems(res)
            this.$router.replace('/cabinet')
          })
          .catch(err => {
            this.$notify({
              type: 'danger',
              message: err.response.data.message,
              duration: 7000
            })
          })
      },

      sendEmailForPassword($event) {
        this.changePassword($event)
          .then(() => {
            this.$notify({
              type: 'danger',
              message: 'Проверьте вашу почту',
              duration: 7000
            })
          })
          .catch(err => {
            this.$notify({
              type: 'danger',
              message: err.response.data.message,
              duration: 7000
            })
          })
      },

      setStorageItems(res) {
        const { access_token, refresh_token } = res
        const { permissions, info } = res
        lStorage('tokens', { access_token, refresh_token })
        lStorage('user', { permissions, info })
      }
    },

    computed: {
      isRegistration() {
        return this.$route.path.includes('/auth/registration')
      },

      isPasswordChange() {
        return this.$route.path.includes('/auth/password')
      }
    },

    watch: {
      '$route.path': {
        immediate: true,
        handler: function () {
          this.show = false
          setTimeout(() => this.show = true, 100)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .auth-page {
    @include flexAlign(center, center);
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: $white;
    overflow-y: auto;
  }

  .hidden {
    overflow: hidden !important;
  }

  .flex-start {
    align-items: flex-start;
  }

  .captcha {
    @include flexAlign(center, center, column);

    &__code {
      margin: 20px 0;
    }

    &__btn {
      margin: 10px 0;
    }
  }
</style>
