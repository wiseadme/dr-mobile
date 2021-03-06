<template>
  <div :class="['aggregators-page']">
    <DrChart
      v-if="showChart"
      :chartParams="chartParams"
      @close-chart="showChart = false"
    />
    <div class="cab-top">
      <div class="date-wrap">
        <Datepicker
          ref="dp"
          placeholder="Выберите дату события"
          :value="checkedDate"
          :language="language"
          :monday-first="true"
          :disabled-dates="disabledDates"
          :highlighted="highlighted"
          :day-cell-content="changeCalendarContent"
          @selected="selectedHandler"
          @selectedDisabled="selectedHandler"
          @opened="showAgregators = false"
        >
        </Datepicker>
        <div v-if="showAggregators" :class="['date-attr']">
          <i :class="['material-icons date-attr__icon', isEventDay ? 'green': 'red']">
            {{isEventDay ? 'thumb_up' : 'thumb_down'}}
          </i>
          <span class="date-attr__text">{{ eventStatus }}</span>
        </div>
      </div>
      <div class="select">
        <v-select
          v-if="aggregators.items.length && showAggregators"
          :items="aggregators.items"
          extKey="name"
          color="#063B87"
          placeholder="выберите агрегатора из списка"
          pre-icon="dns"
          @input="changeSelected"
        />
        <transition name="fadeIn" v-show="dateParams">
          <div :class="['select__info', 'classic-color']" v-if="selected">
            <v-text-indicator
              :text="`Всего ОУ ${ objects.params.totalElements }`"
              :type="objects.items.length ? 'scs' : 'dng'"
            />
            <v-text-indicator
              v-if="dateParams.isXmlAvailability"
              :text="`В том числе готовых к событию ${ objects.params.totalReady }`"
              :type="readyForAction ? 'scs': 'dng'"
            />
            <v-text-indicator
              v-if="isEventDay && dateParams.isFinished"
              :text="`В том числе исполненных ${ confirmed }`"
              :type="confirmed ? 'scs' : 'wrn'"
            />
            <v-text-indicator
              v-if="isEventDay && dateParams.isFinished && selected.reductionVolume"
              :text="`Исполнено обязательств (МВт): ${ selected.reductionVolume }`"
              :type="selected.reductionVolume ? 'scs' : 'wrn'"
            />
          </div>
        </transition>
      </div>
    </div>
    <transition name="slideUp" mode="in-out">
      <div
        ref="results"
        class="cab-bottom"
        v-scroll="fetchAggregatorObjects"
        v-show="objects.items.length"
      >
        <div class="results">
          <div class="results__item" v-for="(it, i) of objects.items" :key="it.name + i" ref="items">
            <DrObjectCard
              :item="it"
              :is-event-day="isEventDay"
              :date-params="dateParams"
              :info="{name: selected.name}"
              v-show="selected"
              @click="setObjectEquipments"
              @open-chart="openChart"
            />
          </div>
        </div>
        <dr-loader :show="showItemsPreload && !showInfoModal"/>
      </div>
    </transition>
    <transition name="fadeIn">
      <div class="empty" v-show="(showEmptyStatus || !showEmptyStatus) && !isEventDay && !aggregators.items.length"
      >
        <i class="material-icons empty-icon" v-show="showEmptyStatus">cloud_off</i>
        <span class="empty-message">
          {{
          showEmptyStatus? 'Информация о статусе готовности отсутствует' : 'Загрузка...'
          }}
        </span>
      </div>
    </transition>
    <transition name="fadeIn">
      <v-modal
        v-show="showInfoModal"
        modal-color="#063B87"
        @close="showInfoModal = false"
        :body-scroll="true"
        ref="modal"
      >
        <img
          class="modal-logo"
          slot="header"
          :src="require('../assets/images/logo-white.svg')"
        >
        <div class="modal-header-wrap" slot="header">
          <h1 class="modal-header">{{ selected.name }}</h1>
          <h2 class="modal-header">{{ `ОУ ${equipments.objectName}` }}</h2>
          <h2 class="modal-header">{{ `Всего ${equipments.total} устройств` }}</h2>
          <h2 class="modal-header" v-if="equipments.reductionVol && dateParams.isFinished">
            {{ `Исполнено обязательств ${equipments.reductionVol}(МВт)` }}
          </h2>
        </div>
        <div
          ref="modal"
          class="modal-body"
          slot="body"
          v-scroll="fetchObjectEquipments"
        >
          <div class="equipments" v-for="(eq, i) in equipments.items" :key="eq.name + i">
            <DrEquipmentCard
              :item="eq"
              :dateParams="dateParams"
              :ready-status="dateParams.isXmlAvailability"
              :object-name="equipments.objectName"
              @open-chart="openChart"
            />
          </div>
        </div>
        <dr-loader slot="footer" :show="showItemsPreload"/>
      </v-modal>
    </transition>
  </div>
</template>
<script>
  import Datepicker from 'vuejs-datepicker'
  import { ru } from 'vuejs-datepicker/dist/locale'
  import DrLoader from '@/components/ui/DrLoader'
  import DrObjectCard from '@/components/DrObjectCard'
  import DrEquipmentCard from '@/components/DrEquipmentCard'
  import DrChart from '@/components/DrChart'
  import timezone from '@/schemes/timezones'

  export default {
    components: {
      Datepicker,
      DrObjectCard,
      DrEquipmentCard,
      DrChart,
      DrLoader
    },
    props: {
      page: {}
    },
    data() {
      return {
        language: ru,
        checkedDate: '',
        openDate: '',
        selected: '',
        dates: [],
        dateParams: null,
        disabledDates: {
          dates: [],
        },
        highlighted: {
          dates: [],
          includeDisabled: true
        },
        isEventDay: false,
        showAggregators: false,
        showInfoModal: false,
        showItemsPreload: false,
        showChart: false,
        showEmptyStatus: false,
        chartParams: null,
        aggregators: {
          items: [],
          page: 0,
          more: true
        },
        objects: {
          aggregatorId: '',
          items: [],
          objectId: '',
          page: 0,
          more: true,
          params: {}
        },
        equipments: {
          controlObjectId: '',
          reductionVol: '',
          objectName: '',
          items: [],
          page: 0,
          total: '',
          more: true
        },
        listElement: null,
        nextWorkingDay: null,
        responseDatetime: ''
      }
    },

    async created() {
      // console.time('start')
      await this.fetchAllDates()
      this.setEvents()
      this.setHolidays()
      this.findNextWorkingDay(this.$moment.tz(this.responseDatetime, timezone.Moscow ))
      this.selectedHandler()
      this.$moment.lang('ru')
      // console.timeEnd('start')
    },

    methods: {
      ...mapActions({
        getEventDates: `Data/${ action.GET_EVENT_DATES }`,
        fetchAggregators: `Data/${ action.FETCH_AGGREGATORS }`,
        fetchEquipments: `Data/${ action.FETCH_EQUIPMENTS }`,
        fetchObjects: `Data/${ action.FETCH_OBJECTS }`,
        getChartParams: `Data/${ action.GET_CHART_PARAMS }`
      }),

      openChart({ type, uid, header }) {
        this.getChartParams({
          type, uid,
          date: this.formatDate(this.checkedDate)
        })
          .then(res => {
            this.chartParams = { ...res, header }
            this.showChart = true
          })
      },

      formatDate(date) {
        return this.$moment(date).format('YYYY-MM-DD')
      },

      findDate(datesArray, date = null) {
        return datesArray.find(it => {
          if (!date && it.eventDate) {
            return it.eventDate === this.formatDate(this.checkedDate)
          }
          if (date && !it.eventDate) {
            return this.formatDate(it) === this.formatDate(date)
          }
          return it.eventDate === this.formatDate(date)
        })
      },

      setDateParams() {
        let date = this.findDate(this.dates.events)
        this.isEventDay = !!date
        !date ? date = this.findDate(this.dates.dates) : false
        this.dateParams = date
      },

      async fetchAllDates() {
        const { data, headers } = await this.getEventDates()
        this.openDate = this.setOpenDate(headers)
        this.responseDatetime = headers.date
        this.dates = data
      },

      setEvents() {
        this.dates.events.forEach(it => {
          this.disabledDates.dates.push(new Date(it.eventDate))
        })
      },

      setHolidays() {
        this.dates.holidays.forEach(it => {
          this.highlighted.dates.push(new Date(it))
        })
      },

      setOpenDate(headers) {
        return new Date(this.timezoneDate(headers.date) + (this.oneDay))
      },

      timezoneDate(dateTime) {
        const timezone = this.$moment.tz(dateTime, 'Europe/Moscow')
        const [year, month, day] = this.$moment(timezone.format())._a
        return new Date(year, month, day).getTime()
      },


      findNextWorkingDay(date) {
        let tomorrow = this.timezoneDate(date) + this.oneDay
        let notWorkingDay = this.dates.holidays.find(it => {
          return this.formatDate(new Date(tomorrow)) === this.formatDate(it)
        })
        if (notWorkingDay) {
          return this.findNextWorkingDay(tomorrow)
        }
        this.nextWorkingDay = new Date(tomorrow)
        this.checkedDate = this.$route.params.event || this.nextWorkingDay
      },

      selectedHandler(date = null) {
        if (date) {
          if (date.timestamp) {
            this.checkedDate = new Date(date.timestamp)
          } else {
            this.checkedDate = date
          }
        }
        this.clearBeforeShow()
        this.setDateParams()
        this.setAggregators()
        this.showEmptyStatus = !this.dateParams
        setTimeout(() => this.showAggregators = true)
      },

      clearBeforeShow() {
        this.resetAggregators()
        this.showAggregators = false
        this.selected = ''
        if (this.$refs.dp) {
          this.$refs.dp.close()
        }
      },

      resetAggregators() {
        this.aggregators.items = []
        this.aggregators.page = 0
        this.aggregators.more = true
        this.resetObjects()
      },

      resetObjects() {
        this.objects.items = []
        this.objects.page = 0
        this.objects.more = true
        this.resetObjectEquipments()
      },

      resetObjectEquipments() {
        this.equipments.items = []
        this.equipments.page = 0
        this.equipments.more = true
      },

      changeSelected(it) {
        this.resetObjects()
        this.selected = it
        setTimeout(() => {
          this.setAggregatorObjects()
        }, 200)
      },

      async setAggregators() {
        await this.fetchAggregators({
          date: this.formatDate(this.checkedDate),
          page: this.aggregators.page
        })
          .then(({ aggregators }) => {
            if (aggregators && aggregators.length) {
              aggregators.map(it => {
                this.aggregators.items.push(it)
              })
              this.showAgregators = true
              this.aggregators.page += 1
            } else {
              this.showEmptyStatus = true
            }
          })
      },

      setAggregatorObjects() {
        this.resetObjects()
        if (this.showAgregators) {
          this.fetchAggregatorObjects()
        }
      },

      fetchAggregatorObjects() {
        if (this.objects.more && this.selected) {
          this.showItemsPreload = true
          this.fetchObjects({
            aggregatorId: this.selected.uid,
            date: this.formatDate(this.checkedDate),
            page: this.objects.page
          })
            .then(res => {
              res.objects.map(it => {
                this.objects.items.push(it)
              })
              this.objects.params = {
                totalElements: res.totalElements,
                totalReady: res.totalReady,
                totalSuccessResult: res.totalSuccessResult
              }
              this.objects.more = res.more
              this.objects.page += 1
              this.hideItemsPreloader(500)
            })
            .catch((err) => console.error(err))
        }
      },

      setObjectEquipments(obj) {
        this.equipments.objectName = obj.name
        this.equipments.reductionVol = obj.reductionVolume
        this.objects.objectId = obj.uid
        this.resetObjectEquipments()
        this.fetchObjectEquipments()
      },

      fetchObjectEquipments() {
        if (this.equipments.more && !this.showItemsPreload) {
          if (this.selected) {
            this.showItemsPreload = true
          }
          this.fetchEquipments({
            controlObjectId: this.objects.objectId,
            date: this.formatDate(this.checkedDate),
            page: this.equipments.page
          })
            .then(res => {
              res.equipments.map(it => {
                this.equipments.items.push(it)
              })
              this.showInfoModal = true
              this.equipments.more = res.more
              this.equipments.page += 1
              this.equipments.total = res.totalElements
              this.hideItemsPreloader(500)
            })
            .catch((err) => {
              console.error(err)
              this.showItemsPreload = false
            })
        }
      },

      hideItemsPreloader(duration) {
        setTimeout(() => {
          this.showItemsPreload = false
        }, duration)
      },

      //этот говнокод нужно отрефакторить
      changeCalendarContent(e) {
        if (this.dates.dates || this.dates.events) {
          const { day, canceledDay, eventDay, date } = this.detectDateStatus(e)
          const { isXmlAvailability, isXmlEvent } = canceledDay ? canceledDay : eventDay ? eventDay : false
          const nextWorkingDate = date.getTime() === this.nextWorkingDay?.getTime()
          if (nextWorkingDate && isXmlAvailability && !isXmlEvent) return day + ' ?'
          if (nextWorkingDate && !isXmlAvailability && isXmlEvent) return day + ' !'
          if (eventDay && eventDay.isFinished) return day + ' &#10004;'
          return day
        }
      },

      detectDateStatus(dateParams) {
        const date = new Date(dateParams.timestamp)
        const day = date.getDate()
        const isPast = dateParams.timestamp < new Date().getTime()
        const holiday = this.findDate(this.dates.holidays, this.formatDate(date))
        const canceledDay = !holiday ? this.findDate(this.dates.dates, this.formatDate(date)) : null
        const eventDay = !holiday && !canceledDay ? this.findDate(this.dates.events, this.formatDate(date)) : null
        return { date, day, isPast, holiday, canceledDay, eventDay }
      }
    },

    computed: {
      oneDay() {
        return 24 * 60 * 60 * 1000
      },

      readyForAction() {
        return this.objects.items.filter(it => it.ready).length
      },

      confirmed() {
        return this.objects.items.filter(it => it.eventResult).length
      },

      eventStatus() {
        const event = this.findDate(this.dates.events)
        if (event) return event.statusName
        else {
          const date = this.findDate(this.dates.dates)
          if (date && !date.isXmlEvent) return 'нет данных'
          if (date && date.isRejected) return date.statusName
        }
        return 'нет данных'
      }
    },
  }
</script>

<style lang="scss">
  .date-wrap {
    position: relative;
    width: 400px;
    max-width: 100%;
    height: 44px;
    margin: 10px auto;
  }

  .vdp-datepicker {
    width: 400px;
    max-width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;

    & > div {
      &:nth-child(1) {
        border: 4px solid $classicBlue !important;
      }
    }

    div:nth-child(1) {
      border: 4px solid $white;
      border-radius: 10px;
      overflow: hidden;
      height: 45px !important;
    }

    input {
      @include fontExo($classicBlue, 1em);
      width: 100%;
      height: 100%;
      padding: 10px;
      text-align: right;
      background: transparent !important;

      &::placeholder {
        color: $white;
      }
    }

    &__calendar {
      @include fontExo($white, 12px);
      background: $classicBlue !important;
      width: 400px !important;
      max-width: 100% !important;
      border: none !important;
      border-radius: 10px;
      padding: 5px;
      box-shadow: $boxShadow;
      top: 110%;

      .prev, .next {
        background: $classicBlue;

        &:hover {
          background: $classicBlue !important;
        }
      }

      .prev {
        &::after {
          content: "" !important;
          display: block !important;
          width: 0 !important;
          height: 0 !important;
          border-top: 8px solid transparent !important;
          border-bottom: 8px solid transparent !important;
          border-right: 10px solid $white !important;
        }
      }

      .next {
        &::after {
          content: "" !important;
          display: block !important;
          width: 0 !important;
          height: 0 !important;
          border-top: 8px solid transparent !important;
          border-bottom: 8px solid transparent !important;
          border-left: 10px solid $white !important;
        }
      }

      .up {
        background: $classicBlue;

        &:hover {
          background: none !important;
        }
      }

      .selected {
        background: $orange !important;
        color: $white !important;
      }

      .disabled {
        @include fontExo($red, 12px);
        color: $white !important;
        background: $greenLight;
      }

      .day:not(.disabled) {
        background: transparent;
      }

      .blank {
        background: $classicBlue !important;
      }

      .today:not(.selected) {
        background: $darkGrey !important;
      }
    }
  }

  .highlighted {
    background: transparent !important;
    color: $orange;
  }


  .aggregators-page {
    @include flexAlign(center, flex-start, column);
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .cab-top {
    width: 90%;
  }

  .cab-bottom {
    width: 450px;
    max-width: 90%;
    height: 100%;
    overflow-y: auto;
    padding: 10px;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
    background: $white;
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
        background: #ffffff;
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
    }
  }

  .date-attr {
    @include flexAlign(center, center);
    font-family: 'Nunito-Regular', sans-serif;
    font-size: 12px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    font-weight: bold;
    padding: 5px 0 4px 0;
    width: 150px;
    max-width: 50%;
    text-align: center;
    margin: auto;

    &__text {
      color: $classicBlue;
    }

    &__icon {
      margin: 0 10px;
      font-size: 16px !important;
    }
  }

  .red {
    color: $red !important;
  }

  .green {
    color: $green !important;
  }

  .select {
    width: 400px;
    max-width: 100%;
    margin: auto;

    &__info {
      @include flexAlign(flex-start, flex-start, column);
      width: 90%;
      padding: 10px;
      margin: 20px auto;
      border-radius: 10px;
      box-shadow: $boxShadow;

      &-item {
        @include flexAlign(center, flex-start);
        height: 25px;
        width: 100%;
      }

      &-text {
        font-family: "Exo2-Regular", sans-serif;
        font-size: 16px;
        padding: 3px;
      }
    }
  }

  .results {
    width: 100%;
    height: auto;
    background: $white;
    margin: auto;
    position: relative;

    &__item {
      margin: 10px 0px 20px 0px;
    }
  }

  .equipments {
    @include flexAlign(center, space-between);
    flex-wrap: wrap;
    width: 100%;
    border-bottom: 1px solid $white;
    border-radius: 3px;
    padding: 5px;
  }

  .empty {
    @include flexAlign(center, center, column);
    height: 50vh;
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    &-icon {
      font-size: 25vw !important;
      color: $classicBlue
    }

    &-message {
      @include fontNun($classicBlue, 12px)
    }
  }
</style>
