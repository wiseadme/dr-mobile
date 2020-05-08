<template>
  <div class="notify-page">
    <div class="filter">
      <v-select
        v-model="selected"
        placeholder="выбрать фильтр"
        color="#063B87"
        :items="filterItems ? filterItems: []"
        pre-icon="list"
        label="фильтр уведомлений"
        extKey="name"
        @input="fetchBySelectedValue"
      />
    </div>
    <div ref="messages" class="messages">
      <DrInfoCard
        ref="message"
        v-for="(it, i) in notifyItems"
        :key="i"
        :item="it"
        :status="paramsObject.status"
        :okButton="selected.code === 'consumer'? 'подтвердить': ''"
        :cancelButton="selected.code === 'consumer'? 'отклонить': ''"
        confirmMessage="подтвержден"
        rejectMessage="отклонен"
        info-head="Уведомление"
        @open-comment="openCommentModal"
        @approve="showWarning"
        @reject="showWarning"
        @click="showOnEventCalendar"
      />
    </div>
    <dr-loader :show="showLoader"/>
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
    <v-modal
      v-if="showCommentModal"
      @close="showCommentModal = false"
      modal-color="#063B87"
    >
      <img
        class="modal-logo"
        slot="header"
        :src="require('../assets/images/logo-white.svg')"
      >
      <div class="modal-header-wrap" slot="header">
        <h1 class="modal-header">Комментарий</h1>
      </div>
      <div class="modal-body" slot="body">
        <div class="modal-body__text">{{ comment }}</div>
      </div>
    </v-modal>
  </div>
</template>
<script>
  import DrInfoCard from '@/components/DrInfoCard'
  import infiniteScroll from '@/services/infiniteScroll'
  import DrLoader from '@/components/ui/DrLoader'
  import { debounce } from '@/services/debounce'
  import permissionsMixin from '@/components/mixins/permissions'

  export default {
    components: {
      DrInfoCard,
      DrLoader
    },

    mixins: [permissionsMixin],

    data() {
      return {
        paramsObject: {
          codeInteger: 1,
          pageSize: 10,
          page: 0
        },
        more: false,
        showLoader: false,
        selected: null,
        notifyItems: [],
        comment: null,
        userNotifications: [],
        filterItems: null,
        showWarningModal: false,
        showCommentModal: false,
        currentAction: null,
      }
    },

    async created() {
      this.scrollHandler = debounce(this.scrollHandler, 50)
      await this.fetchNotificationTypes().then(res => this.filterItems = res)
      this.selected = this.filterItems.find(it => it.code === 'event')
    },

    mounted() {
      this.$refs.messages.addEventListener('scroll', this.scrollHandler)
    },

    methods: {
      ...mapActions({
        fetchNotificationTypes: `Data/${ action.FETCH_NOTIFY_TYPES }`,
        fetchNotifications: `Data/${ action.FETCH_NOTIFICATIONS }`,
        confirmUser: `Data/${ action.CONFIRM_USER }`
      }),

      openCommentModal(comment) {
        this.comment = comment
        this.showCommentModal = true
      },

      showOnEventCalendar(it) {
        if (this.selected.code !== 'event') return
        this.$router.push(`/cabinet/events/${ it.eventDate }`)
      },

      showWarning({ item, flag }) {
        this.showWarningModal = true
        if (flag) {
          return this.currentAction = this.approveHandler.bind(this, item)
        }
        this.currentAction = this.rejectHandler.bind(this, item)
      },

      approveHandler(user) {
        this.confirmUser({
          approve: true,
          email: user.login
        })
        this.filterNotifications(user)
        this.showWarningModal = false
      },

      rejectHandler(user) {
        this.confirmUser({
          approve: false,
          email: user.login
        })
        this.filterNotifications(user)
        this.showWarningModal = false
      },

      filterNotifications(user) {
        this.notifyItems = this.notifyItems.filter(it => it.inn !== user.inn)
      },

      refetchNotifications() {
        if (this.showLoader || !this.more) return
        this.showLoader = true
        this.fetchNotifications(this.paramsObject)
          .then(res => this.responseHandler(res))
        setTimeout(() => this.showLoader = false, 500)
      },

      fetchBySelectedValue({ codeInteger }) {
        this.paramsObject.codeInteger = codeInteger
        this.resetAllNotifications()
        return this.fetchNotifications(this.paramsObject)
          .then(res => this.responseHandler(res))
      },

      resetAllNotifications() {
        this.paramsObject.page = 0
        this.notifyItems = []
      },

      responseHandler(res) {
        this.notifyItems = [...this.notifyItems, ...res.items]
        this.paramsObject.page += 1
        this.more = res.more
      },

      scrollHandler() {
        infiniteScroll(this.$refs.messages, 50, this.refetchNotifications)
      }
    }
  }
</script>

<style lang="scss">
  .messages {
    @include flexAlign(center, flex-start, column);
    overflow-y: auto;
    height: 100vh;
  }

  .filter {
    width: 450px;
    max-width: 90%;
    margin: 10px auto;
  }

  .modal {
    &-body {
      &__text {
        @include fontNun($white, 14px);
        width: 100%;
        text-align: center;
        padding: 10px 0;
      }
    }
  }

  @media screen and(max-width: 1024px) {
    .messages {
      height: calc(100vh - 160px) !important;
    }
  }

  @media screen and(max-width: 968px) {
    .messages {
      height: calc(100vh - 130px) !important;
    }
  }
</style>
