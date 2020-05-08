<template>
  <div class="profile-page">
    <div class="profile">
      <div class="profile__head">
        <h1 class="profile__head-name">{{ userInfo.name ? userInfo.name : 'АО "СО ЕЭС"' }}</h1>
        <span class="profile__about">{{ userInfo.inn ? `инн: ${userInfo.inn}`: `инн: 7705454461` }}</span>
      </div>
      <div class="profile__functions">
        <div class="profile__invite" v-if="cabinet && cabinet.isInviteAllowed">
          <div class="profile__invite-roles">
            <span :class="['profile__invite-head', 'profile__invite-head--classic']">
              <i class="material-icons">book</i>
              Приглашения
            </span>
          </div>
          <v-input
            v-model="invite.invitedEmail"
            label="Введите почту для приглашения"
            color="#063B87"
            pre-icon="email"
          />
          <div class="profile__invite-btn">
            <v-button
              text="пригласить"
              type="info"
              :disabled="!isInfoValid"
              @click="inviteUser"
            />
          </div>
        </div>
      </div>
      <div class="profile__users-btn" v-if="cabinet && cabinet.isUsersList">
        <v-button
          text="список пользователей"
          type="info"
          @click="$router.push('/cabinet/profile/users')"
        />
      </div>
      <div class="profile__settings">
        <span :class="['profile__settings-head', 'profile__settings-head--classic']">
          <i class="material-icons">settings</i>
          Настройки профиля
        </span>
        <div class="profile__settings-buttons">
          <div class="profile__settings-button">
            <v-button
              text="изменить пароль"
              type="info"
              @click="showPasswordModal = true"
            />
          </div>
        </div>
      </div>
    </div>
    <v-modal
      v-if="showPasswordModal"
      @close="showPasswordModal = false"
      modal-color="#063B87"
    >
      <img
        class="modal-logo"
        slot="header"
        :src="require('../assets/images/logo-white.svg')"
      >
      <div class="modal-header-wrap" slot="header">
        <h1 class="modal-header">Изменение пароля</h1>
      </div>
      <div class="modal-body" slot="body">
        <form class="form">
          <div class="form-block">
            <v-input
              v-model="password.val"
              color="white"
              type="password"
              label="текущий пароль"
              pre-icon="lock"
              :isValid="password.valid"
              @input="isValid('password', 'password')"

            />
          </div>
          <div class="form-block">
            <v-input
              v-model="newPassword.val"
              color="white"
              type="password"
              label="новый пароль"
              pre-icon="vpn_key"
              :isValid="newPassword.valid"
              @input="isValid('password', 'newPassword')"
            />
          </div>
          <div class="form-block">
            <v-input
              v-model="confirmNewPassword.val"
              color="white"
              type="password"
              label="повторите новый пароль"
              pre-icon="vpn_key"
              :isValid="confirmPassIsSame"
            />
          </div>
          <div class="btn-block">
            <v-button
              text="изменить"
              type="info"
              :disabled="!isFormValid"
              @click="changeProfilePassword"
            />
          </div>
        </form>
      </div>
    </v-modal>
  </div>
</template>

<script>
  import permissionsMixin from '@/components/mixins/permissions'
  import { validate } from '../services/validators'

  export default {
    mixins: [permissionsMixin],
    data() {
      return {
        userInfo: null,
        invite: {
          invitedEmail: '',
          invitedRoleType: 'AGGREGATOR',
        },
        invitedList: [],
        showPasswordModal: false,
        password: {
          val: '',
          valid: null
        },
        newPassword: {
          val: '',
          valid: null
        },
        confirmNewPassword: {
          val: '',
          valid: null
        }
      }
    },

    created() {
      this.userInfo = this.info
    },

    methods: {
      ...mapActions({
        sendInvite: `Data/${ action.SEND_INVITE }`,
        changePassword: `Data/${ action.CHANGE_PROFILE_PASSWORD }`
      }),

      isValid(validator, key) {
        this[key].valid = validate(validator, this[key].val)
      },

      changeProfilePassword() {
        this.changePassword({
          currentPassword: this.password.val,
          newPassword: this.newPassword.val
        })
          .then(() => {
            this.$notify({
              type: 'success',
              message: 'пароль успешно изменен'
            })
            this.showPasswordModal = !this.showPasswordModal
          })
      },

      inviteUser() {
        this.invitedList.push(this.invite)
        this.sendInvite({ invitedList: this.invitedList })
          .then(res => {
            this.$notify({
              type: 'success',
              message: res.message,
              duration: 3000
            })
          })
        this.invitedList = []
      }
    },

    computed: {
      ...mapState({
        info: state => state.Auth.user.info
      }),
      isInfoValid() {
        return !!this.invite.invitedEmail
      },

      confirmPassIsSame() {
        return (this.confirmNewPassword.val === this.newPassword.val) && this.newPassword.valid
      },

      isFormValid() {
        return this.password.valid && this.confirmPassIsSame
      }
    }
  }
</script>

<style lang="scss">
  .profile-page {
    @include flexAlign(center, flex-start, column);
    height: 100%;
    overflow: hidden;
  }

  .profile {
    position: relative;
    margin-top: 20px;
    width: 450px;
    max-width: 90%;
    min-height: 150px;

    &__about {
      @include fontNun($white, 12px);
    }

    &__head {
      @include flexAlign(flex-start, center, column);
      padding: 15px;
      height: 20vh;
      border-radius: 5px;
      box-shadow: $boxShadow;
      background: $classicBlue;

      &-name {
        @include fontNun($white, 1.4em);
        padding: 10px 0;
      }

      &-role {
        @include fontExo($darkBlue, .8em)
      }
    }

    &__text {
      display: block;
      padding: 0 15px;
      @include fontNun($white, 0.9em);
    }

    &__functions {
      @include flexAlign(center, center, column);
      width: 100%;
      margin-top: 10px;
    }

    &__settings {
      @include flexAlign(center, center, column);
      width: 100%;
      margin-top: 20px;
      border-radius: 5px;

      &-head {
        @include fontNun($classicBlue, 1em);
        @include flexAlign(center, center);
        width: 100%;
        padding: 10px 0;

        &--classic {
          color: $classicBlue;
          border-bottom: 1px solid $classicBlue
        }

        &--new {
          color: $white;
          border-bottom: 1px solid $white
        }
      }

      &-buttons {
        margin-top: 10px;
        width: 100%;
      }

      &-button {
        margin-top: 5px;
        width: 100%;
      }
    }


    &__invite {
      width: 100%;
      margin: 10px 0;

      &-head {
        @include fontNun($classicBlue, 1em);
        @include flexAlign(center, center);
        width: 100%;
        padding: 10px 0;

        &--classic {
          color: $classicBlue;
          border-bottom: 1px solid $classicBlue
        }

        &--new {
          color: $white;
          border-bottom: 1px solid $white
        }
      }

      &-roles {
        width: 100%;
        padding: 10px 0;
      }

      &-btn {
        margin: 4% 0;
      }
    }

    &__users-btn {

    }
  }

  .classic-style {
    color: $classicBlue
  }

  @media screen and(max-width: 340px) {
    .profile {
      margin-top: 10px;

      &__head {
        @include flexAlign(center, center, column);
        padding: 15px;
        height: 12vh;

        &-name {
          font-size: 1em !important;
          padding: 10px 0;
        }

        &-role {
          @include fontExo($white, .7em)
        }
      }

      &__invite {
        margin: 5px 0;

        &-head {
          font-size: .8em;
          padding: 5px 0;
        }

        &-roles {
          padding: 10px 0;
        }
      }

      &__settings {
        margin-top: 10px;

        &-head {
          font-size: .8em;
          padding: 5px 0;
        }

        &-button {
          margin-top: 10px;
          width: 100%;
        }
      }
    }
  }

  .form {
    width: 100%;
    margin: 20px 0;

    &-block {
      &:nth-child(3) {
        margin-bottom: 20px;
      }
    }
  }
</style>
