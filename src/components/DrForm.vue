<template>
  <form class="form" ref="form">
    <div class="form-head">
      <img
        class="form-logo"
        :style="{width: '50px', margin: '10px 0'}"
        :src="require('../assets/images/logo-native.svg')"
      >
      <span class="form-head__app-name">Demand Response Mobile</span>
      <h1>{{ actualForm.title }}</h1>
    </div>
    <div class="form-block">
      <v-input
        ref="input"
        v-model="form.email.val"
        label="Почта"
        placeholder="Введите почту..."
        pre-icon="account_circle"
        color="#063B87"
        :required="true"
        :isValid="form.email.valid"
        @input="isValid('email', 'email')"
      />
    </div>
    <div class="form-block" v-if="$route.path === '/auth/registration'">
      <v-input
        v-model="form.inn.val"
        label="ИНН"
        placeholder="Введите ИНН"
        pre-icon="vpn_key"
        color="#063B87"
        :required="true"
        :isValid="form.inn.valid"
        @input="isValid('inn', 'inn')"
      />
    </div>
    <div class="form-block" v-if="$route.path === '/auth/registration'">
      <v-input
        v-model="form.inn2.val"
        label="ИНН Агрегатора"
        placeholder="Введите ИНН"
        pre-icon="vpn_key"
        color="#063B87"
        :required="true"
        :isValid="form.inn2.valid"
        @input="isValid('inn', 'inn2')"
      />
    </div>
    <div class="form-block" v-if="!isPasswordChange">
      <v-input
        v-model="form.password.val"
        label="Пароль"
        placeholder="Введите пароль..."
        pre-icon="lock"
        type="password"
        color="#063B87"
        :required="true"
        :isValid="form.password.valid"
        :remind="!isRegistration ? 'Забыли пароль' : ''"
        remind-to="/auth/password"
        @input="isValid('password', 'password')"
      />
    </div>
    <div class="form-block" v-if="isRegistration && !isPasswordChange">
      <v-input
        v-model="form.confirmPass.val"
        label="Повторите пароль"
        placeholder="Введите пароль..."
        pre-icon="lock"
        type="password"
        color="#063B87"
        :required="true"
        :isValid="confirmPassIsSame"
      />
    </div>
    <div class="form-area-block" v-if="isRegistration && !isPasswordChange">
      <v-area
        v-model="form.comment.val"
        label="Необязательное поле"
        placeholder="введите комментарий"
        limit="200"
      />
    </div>
    <div class="btn-block">
      <v-button
        :text="isRegistration || isPasswordChange ? 'Отправить' : 'Войти'"
        :disabled="disabled || !isFormValid"
        type="info"
        @click="this.sendUserParams"
      />
    </div>
    <div slot="footer" class="form-questions">
      <span class="form-questions__item">
        {{ isRegistration ? 'Есть аккаунт?' : 'Нет аккаунта?' }}
        <router-link class="form-questions__item-link" :to="`/auth/${!isRegistration ? 'registration' : 'login'}`">
          {{ !isRegistration ? 'Зарегистрироваться в качестве потребителя' : 'Войти' }}
        </router-link>
      </span>
    </div>
  </form>
</template>

<script>
  import { validate } from '@/services/validators'
  import { debounce } from '@/services/debounce'

  export default {
    props: {
      isRegistration: {
        type: Boolean,
        required: true
      },
      isPasswordChange: {
        type: Boolean,
        required: true
      },
      disabled: {
        type: Boolean,
        required: true
      }
    },

    data() {
      return {
        formTypes: {
          login: {
            title: 'Форма авторизации',
            event: 'login'
          },
          reg: {
            title: 'Форма регистрации',
            event: 'registration'
          },
          pass: {
            title: 'Форма восстановления пароля',
            event: 'password'
          }
        },
        form: {
          email: {
            val: '',
            valid: null
          },
          inn: {
            val: '',
            valid: null
          },
          inn2: {
            val: '',
            valid: null
          },
          password: {
            val: '',
            valid: null
          },
          confirmPass: {
            val: '',
            valid: null
          },
          comment: {
            val: '',
            valid: null
          },
          role: ''
        },
        userId: '',
        linkId: ''
      }
    },

    created() {
      if (this.isRegistration && this.$route.query.link_id) {
        this.form.email.val = this.$route.query.email
        this.linkId = this.$route.query.link_id
      }
      this.isValid = debounce(this.isValid, 20)
    },

    methods: {
      /**
       *
       * @param key {string} - name of form object property
       * @param validator {string} - name of validation type (email|password|inn)
       */
      isValid(validator, key) {
        this.form[key].valid = validate(validator, this.form[key].val)
      },

      /**
       *
       * User parameters depend from the type of registration.
       * If registration by invitation then - add the "platform",
       * If without invitation - add the "inn"
       */
      getUserParams() {
        const platformFlag = !!this.$route.query.link_id || !this.isRegistration
        const propName = platformFlag ? 'platform' : 'inn'
        if (!this.isPasswordChange) {
          const params = {
            email: this.form.email.val || this.$route.query.email,
            password: this.form.password.val,
            [propName]: platformFlag ? this.device : this.form.inn.val
          }
          if (this.isRegistration && platformFlag) {
            params.link_id = this.$route.query.link_id
          }
          if (this.isRegistration && !platformFlag) {
            params.innAggregator = this.form.inn2.val
            params.comment = this.form.comment.val
          }
          return params
        }
        return { login: this.form.email.val }
      },
      /**
       *
       * here we emit the form event to auth page
       * with user params as event value
       */
      sendUserParams() {
        const event = this.actualForm.event
        this.$emit(event, this.getUserParams())
      }
    },

    computed: {
      ...mapState({
        device: state => state.Auth.device,
        refresh: state => state.Auth.refresh_token
      }),

      isFormValid() {
        if (this.isRegistration && !this.isPasswordChange) {
          if (this.$route.path === '/auth/registration') {
            return this.form.email.valid && this.form.password.valid
              && this.confirmPassIsSame && this.form.inn.valid && this.form.inn2.valid
          }
          return this.form.email.valid && this.form.password.valid && this.confirmPassIsSame
        }
        if (this.isPasswordChange) {
          return this.form.email.valid
        }
        return this.form.email.valid && this.form.password.valid
      },

      confirmPassIsSame() {
        return (this.form.confirmPass.val === this.form.password.val) && this.form.password.valid
      },

      actualForm() {
        if (!this.isRegistration && !this.isPasswordChange) {
          return this.formTypes.login
        }
        if (this.isPasswordChange) {
          return this.formTypes.pass
        }
        return this.formTypes.reg
      }
    }
  }
</script>

<style lang="scss" scoped>
  $boxShadow: 0 6px 7px -4px rgba(0, 0, 0, .2), 0 11px 15px 1px rgba(0, 0, 0, .14), 0 4px 20px 3px rgba(0, 0, 0, .12);
  .form {
    width: 95%;
    height: auto;
    padding: 15px;

    &-block {
      margin: 20px 0;
    }

    &-area-block {
      margin-bottom: 20px;
      height: 100px;
    }

    &-head {
      @include fontNun($classicBlue, 1em);
      @include flexAlign(center, center, column)

      &__app-name {
        font-size: 12px;
        padding: 10px 0;
      }
    }

    &-questions {
      @include flexAlign(center, space-around);
      @include fontNun($classicBlue, 13px);
      padding: 20px 0;

      &__item-link {
        color: $classicBlue;
        font-weight: 900;
        text-decoration: none;
      }
    }
  }

  .btn-block {
    @include flexAlign(center, space-between);
    height: 100%;
    width: 100%;
    padding: 0 15px;
    margin-top: 60px;
  }
</style>
