<template>
  <div
    class="dr-object"
  >
    <div class="dr-object__left">
      <div class="dr-object__params">
        <div class="dr-object__info">
          <span class="dr-object__info-name" v-show="info">{{ info.name }}</span>
          <span
            class="dr-object__info-time"
            v-show="item.timeStart">
            {{ `Время начала разгрузки ${item.timeStart}` }}
          </span>
          <span
            class="dr-object__info-time"
            v-if="item.reductionVolume">
            {{ `Исполнено обязательств ${item.reductionVolume}` }}
          </span>
        </div>
      </div>
      <div class="dr-object__head">
        <span class="dr-object__head-text">{{'ОУ ' + item.name }}</span>
      </div>
      <div class="dr-object__status">
        <div class="dr-object__status-item">
          <i :class="['material-icons', 'dr-object__status-icon', item.ready ? 'done' : 'error']">
            {{ item.ready ? 'done':'report_problem' }}
          </i>
          <span class="dr-object__status-title">{{ item.ready ? 'готов' : 'не готов' }}</span>
        </div>
        <div class="dr-object__status-item" v-if="isEventDay && item.ready && dateParams.isFinished">
          <i :class="['material-icons', 'dr-object__status-icon', item.eventResult ? 'done' : 'error']">
            {{ item.eventResult ? 'done_all':'report_problem' }}
          </i>
          <span class="dr-object__status-title">{{ item.eventResult ? 'исполнено' : 'не исполнено' }}</span>
        </div>
      </div>
    </div>
    <div class="dr-object__right">
      <div class="dr-object__btn" v-if="dateParams.isFinished" @click="$emit('open-chart',
      {uid: item.uid, type: 'controlObject'})">
        <i class="material-icons dr-object__btn-icon">show_chart</i>
      </div>
      <div class="dr-object__btn" @click="$emit('click', item)">
        <i class="material-icons dr-object__btn-icon">power</i>
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
    }
  }
</script>

<style lang="scss" scoped>
  .dr-object {
    @include flexAlign(center, center);
    border-radius: 15px;
    position: relative;
    background: $classicBlue;
    padding: 5px 0;
    height: 130px;

    &__left {
      width: 80%;
      height: 100%;
      @include flexAlign(center, space-between, column)
    }

    &__right {
      width: 20%;
      height: 100%;
      @include flexAlign(center, center, column)
    }


    &__params {
      @include flexAlign(flex-start, center);
      @include fontExo($white, 12px);
      width: 100%;
      height: 30px;
    }

    &__head {
      @include flexAlign(center, flex-start, column);
      @include fontExo($white, 12px);
      font-weight: 800;
      text-transform: uppercase;
      width: 100%;
      padding: 5px;
      margin-top: 15px;
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
        @include fontExo($white, 12px);
      }
    }

    &__info {
      @include flexAlign(center, center, column);
      width: 100%;

      &-name {
        @include fontNun($white, 12px);
        padding: 5px;
        width: 100%;
        text-align: center;
      }

      &-time {
        @include fontNun($white, 12px);
        display: block;
        text-align: center;
        width: 100%;
        padding: 2px 0;
      }
    }

    &__btn {
      @include flexAlign(center, center);
      width: 40px;
      height: 40px;
      border-radius: 5px;
      background: $white;
      margin: 8px 0;

      &-icon {
        color: $classicBlue
      }
    }
  }

  .done {
    color: $white;
  }

  .error {
    color: $orange;
  }
</style>
