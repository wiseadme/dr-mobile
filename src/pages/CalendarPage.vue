<template>
  <div :class="['agregators-page']">
    <div class="cab-top">
      <div class="date-wrap">
        <Datepicker
          ref="dp"
          placeholder="Выберите дату события"
          :value="checkedDate"
          :language="language"
          :monday-first="true"
          :disabled-dates="disabledDates"
          :day-cell-content="changeDayContent"
          @selected="selectedHandler"
          @selectedDisabled="showEventListeners"
          @opened="openHandler"
        >
        </Datepicker>
        <div v-if="showAggregators" :class="['date-attr']">
          <i :class="['material-icons date-attr__icon', isEventDay ? 'green': 'red']">{{isEventDay ?
            'thumb_up' : 'thumb_down'}}</i>
          <span class="date-attr__text">{{ eventStatus }}</span>
        </div>
      </div>
      <div class="select">
        <v-select
          v-if="aggregators.items.length && showAggregators && dateParams.isXmlAvailability"
          :items="aggregators.items"
          extKey="name"
          color="#063B87"
          placeholder="выберите агрегатора из списка"
          pre-icon="dns"
          @input="changeSelected"
        />
        <transition name="fadeIn" v-if="dateParams && dateParams.isXmlAvailability">
          <div :class="['select__info', 'classic-color']" v-if="selected">
            <v-text-indicator
              :text="`Всего ОУ ${ objects.params.totalElements }`"
              :type="objects.items.length ? 'scs' : 'dng'"
            />
            <v-text-indicator
              :text="`В том числе готовых к событию ${ objects.params.totalReady }`"
              :type="readyForAction ? 'scs': 'dng'"
            />
            <v-text-indicator
              v-if="isEventDay && dateParams.isFinished"
              :text="`В том числе исполненных ${ confirmed }`"
              :type="confirmed ? 'scs' : 'wrn'"
            />
          </div>
        </transition>
      </div>
    </div>
    <transition name="slideUp" mode="in-out">
      <div ref="results" class="cab-bottom" v-show="objects.items.length && dateParams.isXmlAvailability">
        <div class="results">
          <div class="results__item" v-for="(it, i) of objects.items" :key="it.name + i" ref="items">
            <DrObjectCard
              @click="setObjectEquipments"
              :item="it"
              :is-event-day="isEventDay"
              :date-params="dateParams"
              :info="{name: selected.name}"
              v-show="selected"
            />
          </div>
        </div>
        <dr-loader :show="showItemsPreload && !showInfoModal"/>
      </div>
    </transition>
    <transition name="fadeIn">
      <div class="empty" v-if="showErrorMessage && !isEventDay ||
      dateParams && !dateParams.isXmlAvailability"
      >
        <i class="material-icons empty-icon">cloud_off</i>
        <span class="empty-message">Информация о статусе готовности отсутствует</span>
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
        </div>
        <div ref="modal" class="modal-body" slot="body">
          <div class="info__item" v-for="(eq, i) in equipments.items" :key="eq.name + i">
            <span class="info__text">{{ eq.name }}</span>
            <v-checkbox color="#ffffff" :isChecked="eq.ready" label="готов" :disabled="true"/>
            <span class="info__sub">
            {{ eq.consumers ? eq.consumers.name : '' }}
          </span>
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
	import infiniteScroll from '@/services/infiniteScroll'
	import DrObjectCard from '../components/DrObjectCard'
	import DrLoader from '@/components/ui/DrLoader'
	import { debounce } from '@/services/debounce'

	export default {
		components: {
			Datepicker,
			DrObjectCard,
			DrLoader
		},
		mixins: [],
		data() {
			return {
				language: ru,
				checkedDate: '',
				selected: '',
				dates: [],
				dateParams: null,
				disabledDates: {
					dates: [],
				},
				showAggregators: false,
				isEventDay: false,
				showInfoModal: false,
				showItemsPreload: false,
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
					objectName: '',
					items: [],
					page: 0,
					total: '',
					more: true
				},
				showErrorMessage: false,
				listElement: null,
        openDate: null
			}
		},

		async created() {
			await this.setEventDates()
			if (this.$route.params.event) {
				this.checkedDate = new Date(this.$route.params.event)
			} else {
				this.checkedDate = this.openDate
			}
			this.selectedHandler()
			this.scrollHandler = debounce(this.scrollHandler, 100)
		},

		mounted() {
			this.setClassicStyleDp()
			this.addListeners()
		},

		methods: {
			...mapActions({
				getEvents: `Data/${action.GET_EVENTS}`,
				getEventDates: `Data/${action.GET_EVENT_DATES}`,
				fetchEquipments: `Data/${action.FETCH_EQUIPMENTS}`,
				fetchObjects: `Data/${action.FETCH_OBJECTS}`
			}),

			formatDate(date) {
				let day = date.getDate() + ''
				let month = (date.getMonth() + 1) + ''
				let year = date.getFullYear() + ''
				date = [day, month, year].map(it => {
					return it.length === 1 ? '0' + it : it
				})
				return date.reverse().join('-')
			},

			changeDayContent(e) {
				let date = this.formatDate(new Date(e.timestamp))
				let day = new Date(e.timestamp).getDate() + ''
				let flag = +day < new Date().getDate()
				let event = ''
				const found = this.dates.dates?.find(it => it.eventDate === date)
				if (!found && this.dates.events) {
					event = this.dates.events.find(it => it.eventDate === date)
				}
				if (found && (found.isXmlAvailability && found.isXmlEvent) && !event) return day + ' &#9872;'
				if (event && event.isPlanned) return day + ' &#9733;'
				if (event && event.isFinished) return day + ' &#10004;'
				if ((!event || !found) && flag) return day + ' &#8855;'
				return day
			},

			scrollHandler(box, offset, callback) {
				infiniteScroll(box, offset, callback)
			},

			async setEventDates() {
				const data = await this.getEventDates()
        this.openDate = new Date(new Date(data.headers.date).getTime() + 24 * 60 * 60 * 1000)
				this.dates = data.data
					this.dates.events.forEach(it => {
						this.disabledDates.dates.push(new Date(it.eventDate))
					})
			},

			// при выборе даты без события на календаре
			selectedHandler(date) {
				if (date) this.checkedDate = date
				this.clearBeforeShow()
				this.detectEventDate()
				if (!this.dateParams) this.detectSimpleDate()
				if (this.dateParams) this.setAggregators()
				this.showErrorMessage = !this.dateParams
				setTimeout(() => this.showAggregators = true)
			},

			//при выборе даты события показываем данные на дату
			showEventListeners({ timestamp }) {
				this.checkedDate = new Date(timestamp)
				this.clearBeforeShow()
				this.detectEventDate()
				this.setAggregators()
				setTimeout(() => this.showAggregators = true)
			},

			//определяем тип и параметры события
			detectEventDate() {
				this.dateParams = this.dates.events.find(it => {
					return it.eventDate === this.formatDate(this.checkedDate)
				})
				return this.isEventDay = true
			},

			detectSimpleDate() {
				this.dateParams = this.dates.dates.find(it => {
					return it.eventDate === this.formatDate(this.checkedDate)
				})
				return this.isEventDay = false
			},

			clearBeforeShow() {
				this.resetAggregators()
				this.showAggregators = false
				this.selected = ''
				if (this.$refs.dp) {
					this.$refs.dp.close()
				}
			},

			openHandler() {
				this.showAgregators = false
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
				this.selected = ''
				this.resetObjects()
				setTimeout(() => {
					this.selected = it
					this.setAggregatorObjects()
				}, 200)
			},

			async setAggregators() {
				const aggr = await this.getEvents({
					date: this.formatDate(this.checkedDate),
					page: this.aggregators.page
				})
				if (aggr && aggr.aggregators) {
					aggr.aggregators.map(it => {
						this.aggregators.items.push(it)
					})
					this.showErrorMessage = false
				}
				this.showAgregators = true
				this.aggregators.page += 1
			},

			setAggregatorObjects() {
				this.resetObjects()
				if (this.showAgregators) {
					this.fetchAggregatorObjects()
				}
			},

			fetchAggregatorObjects() {
				if (this.objects.more) {
					if (this.selected) {
						this.showItemsPreload = true
					}
					this.fetchObjects({
						aggregatorId: this.selected.uid,
						date: this.formatDate(this.checkedDate),
						page: this.objects.page
					})
						.then(res => {
							if (res && res.objects) {
								res.objects.map(it => {
									this.objects.items.push(it)
								})
								const { totalElements, totalReady, totalSuccessResult } = res
								this.objects.params = { totalElements, totalReady, totalSuccessResult }
								this.objects.more = res.more
								this.objects.page += 1
								this.hideItemsPreloader(500)
							}
						})
						.catch((err) => console.log(err))
				}
			},

			setObjectEquipments(obj) {
				this.equipments.objectName = obj.name
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
							console.log(err)
							this.showItemsPreload = false
						})
				}
			},

			hideItemsPreloader(duration) {
				setTimeout(() => {
					this.showItemsPreload = false
				}, duration)
			},

			setClassicStyleDp() {
				if (!this.isNewStyle) {
					const dpWrap = document.querySelector('.vdp-datepicker>div')
					const dp = dpWrap.querySelector('input')
					dp.classList.add('input-classic')
					dpWrap.classList.add('wrap-classic')
				}
			},

			addListeners() {
				this.$refs.results.addEventListener('scroll', this.scrollHandler.bind(this,
					this.$refs.results, 100, this.fetchAggregatorObjects
				))
				this.$refs.modal.$refs.body.addEventListener('scroll', this.scrollHandler.bind(this,
					this.$refs.modal.$refs.body, 80, this.fetchObjectEquipments
				))
			},

			removeListeners() {
				this.$refs.results.removeEventListener('scroll', this.scrollHandler)
				this.$refs.modal.$refs.body.removeEventListener('scroll', this.scrollHandler)
			}
		},

		computed: {
			eventStatus() {
				const event = this.dates.events.find(it => {
					return this.formatDate(this.checkedDate) === it.eventDate
				})
				if (event) return event.statusName
				if (!event) {
					const date = this.dates.dates.find(it => {
						return this.formatDate(this.checkedDate) === it.eventDate
					})
					if (date && !date.isXmlEvent) return 'нет данных'
					if (date && date.isRejected) return date.statusName
				}
				return 'нет данных'
			},

			readyForAction() {
				return this.objects.items.filter(it => it.ready).length
			},

			confirmed() {
				return this.objects.items.filter(it => it.eventResult).length
			},

			tomorrowDate() {
				return new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
			}
		},

		beforeDestroy() {
			this.removeListeners()
		}
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

    div:nth-child(1) {
      border: 4px solid $white;
      border-radius: 10px;
      overflow: hidden;
      height: 45px !important;
    }

    input {
      @include fontExo($white, 1em);
      width: 100%;
      height: 100%;
      padding-bottom: 15px !important;
      text-align: right;
      background: transparent !important;

      &::placeholder {
        color: $white;
      }
    }

    .wrap-classic {
      border: 4px solid $classicBlue !important;
    }

    .input-classic {
      @include fontExo($classicBlue, 1em);
      width: 100%;
      height: 100%;
      padding: 10px;
      background-color: transparent !important;
      text-align: right;

      &::placeholder {
        color: $white;
      }
    }

    &__calendar {
      @include fontExo($darkBlue, 12px);
      background: $white !important;
      width: 400px !important;
      max-width: 100% !important;
      border: none !important;
      border-radius: 10px;
      padding: 5px;
      box-shadow: $boxShadow;
      top: 110%;

      .prev, .next {
        background: $white;

        &:hover {
          background: $white !important;
        }
      }

      .up {
        background: $white;
      }

      .selected {
        background: $blue !important;
        color: $white !important;
      }

      .disabled {
        @include fontExo($red, 12px);
        color: $red !important;
        background: transparent;
        border: 1px solid $blue !important;
      }

      .day:not(.disabled) {
        background: transparent;
      }

      .blank {
        background: $white !important;
      }

      .today:not(.selected) {
        background: transparent !important;
      }

      .today {
        border: 1px solid $orange !important;
      }
    }
  }

  .agregators-page {
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

  @media screen and (max-width: 1024px) {
    .cab-bottom {
      /*height: calc(100% - 130px) !important;*/
    }
  }

  @media screen and (max-width: 968px) {
    .cab-bottom {
      /*height: calc(100% - 56px) !important;*/
    }
  }

  .modal {
    position: relative;

    &-header {
      @include fontExo($blue, 1em);
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

  .info {
    &__item {
      @include flexAlign(center, space-between);
      flex-wrap: wrap;
      width: 100%;
      border-bottom: 1px solid $white;
      border-radius: 3px;
      padding: 10px;
      margin: 5px 0;
    }

    &__text {
      display: block;
      color: $white;
    }

    &__sub {
      padding: 10px 0 0 0;
      width: 100%;
      color: $white;
      font-size: 12px !important;
    }
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
