<template>
  <div class="users-page">
    <div class="filter">
      <v-select
        v-model="usersParams.roleType"
        placeholder="выбрать фильтр"
        label="роль пользователей"
        color="#063B87"
        :items="roles"
        pre-icon="list"
        extKey="name"
        @input="fetchBySelected"
      />
    </div>
    <div ref="users" class="users" v-show="users.length">
      <DrInfoCard
        v-for="(user, i) in users"
        :key="user.login + i"
        :item="user"
        :okButton="cabinet && cabinet.isUsersBlockAllowed ? 'заблокировать' : false"
        info-head="пользователь"
        confirmMessage="заблокирован"
        icon="account_box"
        @approve="showWarning"
      />
      <dr-loader :show="showLoader"/>
    </div>
    <v-modal
      v-if="showWarningModal"
      @close="showWarningModal = false"
      modal-color="#063B87"
    >
      <img
        class="modal-logo"
        slot="header"
        :src="require('../assets/images/logo-white.svg')"
      >
      <div class="modal-header-wrap" slot="header">
        <h1 class="modal-header">ПРЕДУПРЕЖДЕНИЕ</h1>
      </div>
      <div class="modal-body" slot="body">
        <div class="modal-body__text">Вы уверены что хотите продолжить действие?</div>
        <div class="btn-block">
          <v-button
            text="Да"
            type="warning"
            @click="currentAction"
          />
        </div>
      </div>
    </v-modal>
  </div>
</template>

<script>
  import DrInfoCard from '@/components/DrInfoCard'
  import DrLoader from '@/components/ui/DrLoader'
  import { debounce } from '@/services/debounce'
  import infiniteScroll from '@/services/infiniteScroll'
  import permissionsMixin from '@/components/mixins/permissions'

  export default {
    components: {
      DrInfoCard,
      DrLoader
    },

    mixins: [permissionsMixin],

    data() {
      return {
        page: 0,
        status: 'active',
        roles: [],
        users: [],
        usersParams: {
          status: 'active',
          roleType: '',
          page: 0,
        },
        more: true,
        showLoader: false,
        showWarningModal: false,
        currentAction: null
      }
    },

    async created() {
      await this.fetchRoles().then(res => this.roles = res)
      this.scrollHandler = debounce(this.scrollHandler, 50)
      this.usersParams.roleType = this.roles.find(it => {
        return it.code === 'AGGREGATOR'
      })
    },

    mounted() {
      this.$refs.users.addEventListener('scroll', this.scrollHandler)
    },

    methods: {
      ...mapActions({
        fetchUsers: `Data/${ action.FETCH_USERS }`,
        fetchRoles: `Data/${ action.FETCH_USER_ROLES }`,
        disableUser: `Data/${ action.DISABLE_USER }`
      }),

      showWarning(it) {
        this.showWarningModal = true
        this.currentAction = this.removeFromList.bind(this, it)
      },

      scrollHandler() {
        infiniteScroll(this.$refs.users, 50, this.refetchUsers)
      },

      removeFromList(it) {
        this.disableUser({ login: it.item.login })
          .then(res => {
            this.users = this.users.filter(u => u.login !== it.item.login)
            this.$notify({
              type: 'success',
              message: res.message,
              duration: 5000
            })
            this.showWarningModal = false
          })
      },

      async fetchBySelected() {
        this.usersParams.page = 0
        return this.fetchUsers({
          status: this.usersParams.status,
          roleType: this.usersParams.roleType.code,
          page: this.usersParams.page
        })
          .then(res => {
            this.users = res.items
            this.more = res.more
            this.usersParams.page += 1
          })
      },

      refetchUsers() {
        if (this.more) {
          this.showLoader = true
          this.fetchUsers({
            status: this.usersParams.status,
            roleType: this.usersParams.roleType.code,
            page: this.usersParams.page
          })
            .then(res => {
              this.more = res.more
              this.usersParams.page += 1
              setTimeout(() => this.showLoader = false, 500)
            })
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .users-page {
    height: 100%;
    width: 100%;
    overflow-y: hidden;
  }

  .users {
    @include flexAlign(center, flex-start, column);
    overflow-y: auto;
    height: 100vh;
  }

  .filter {
    margin: 10px auto;
    width: 450px;
    max-width: 90%;
  }

  .modal {
    position: relative;

    &-header {
      @include fontExo($classicBlue, 1em);
      margin-bottom: 5px;

      &-wrap {
        width: 100%;
        border: 1px solid $white;
        border-radius: 25px;
        background: $white;
        padding: 5px 0;
        margin: 5px auto;
      }
    }

    &-logo {
      width: 50px;
      margin: 10px 0;
    }

    &-body {
      @include flexAlign(center, flex-start, column);
      padding: 10px 0;

      &__text {
        @include fontNun($white, 14px);
        width: 100%;
        text-align: center;
        padding: 10px 0;
      }
    }
  }

  @media screen and(max-width: 968px) {
    .users, .users-page {
      height: calc(100% - 70px) !important;
    }
  }
</style>
