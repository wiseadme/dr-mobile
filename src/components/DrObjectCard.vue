<template>
  <div
    class="dr-card"
    @click="$emit('click', item)"
  >
    <div class="dr-card__params">
      <div class="dr-card__info">
        <span class="dr-card__info-name" v-show="info">{{ info.name }}</span>
        <span class="dr-card__info-time" v-show="item.timeStart">{{ `время начала разгрузки ${item.timeStart}` }}</span>
      </div>
    </div>
    <div class="dr-card__head">
      <span class="dr-card__head-text">{{'ОУ ' + item.name }}</span>
    </div>
    <div class="dr-card__status">
      <div class="dr-card__status-item">
        <i :class="['material-icons', 'dr-card__status-icon', item.ready ? 'done' : 'error']">
          {{ item.ready ? 'done':'report_problem' }}
        </i>
        <span class="dr-card__status-title">{{ item.ready ? 'готов' : 'не готов' }}</span>
      </div>
      <div class="dr-card__status-item" v-if="isEventDay && item.ready && dateParams.isFinished">
        <i :class="['material-icons', 'dr-card__status-icon', item.eventResult ? 'done' : 'error']">
          {{ item.eventResult ? 'done_all':'report_problem' }}
        </i>
        <span class="dr-card__status-title">{{ item.eventResult ? 'исполнено' : 'не исполнено' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      item: {
        type: Object
      },

      isEventDay: {
        type: Boolean
      },

      info: {
        type: Object
      },

      dateParams: {
        type: Object
      }
    },

    created() {
    },

    computed: {}
  }
</script>

<style lang="scss" scoped>
  .dr-card {
    @include flexAlign(center, center, column);
    border-radius: 15px;
    position: relative;
    background: #f5f5f5;
    padding: 10px 0;


    &__params {
      @include flexAlign(center, center);
      @include fontExo($darkBlue, 14px);
      width: 100%;
      height: 30px;
    }

    &__head {
      @include flexAlign(center, flex-start, column);
      @include fontExo($classicBlue, 14px);
      font-weight: 800;
      text-transform: uppercase;
      width: 100%;
      padding: 10px;
    }

    &__status {
      @include flexAlign(center, space-around);
      width: 90%;
      padding: 5px;

      &-icon {
        margin-right: 10px;
        font-size: 18px;
      }

      &-item {
        @include flexAlign(center, center);
        @include fontExo($darkBlue, 14px);
      }
    }

    &__info {
      @include flexAlign(center, center, column);
      width: 100%;

      &-name {
        @include fontNun($darkBlue, 14px);
        padding: 5px;
        width: 100%;
        text-align: center;
      }

      &-time {
        @include fontNun($darkBlue, 12px);
        display: block;
        text-align: center;
        width: 100%;
      }
    }
  }

  .done {
    color: $blue;
  }

  .error {
    color: $orange;
  }
</style>
