<template>
  <div class="dr-chart">
    <div class="dr-chart__close" @click="$emit('close-chart')">
      <i class="material-icons dr-chart__close-icon">close</i>
    </div>
    <div class="dr-chart__wrap">
      <canvas width="500" ref="canvas"></canvas>
    </div>
    <div class="dr-chart__info">
      <div class="dr-chart__buttons">
        <div
          v-for="it in buttons"
          :key="it.label"
          :class="['dr-chart__btn', {active: it.active}]"
          @click="selectedHandler(it)"
        >
          {{ it.label }}
        </div>
      </div>
      <div class="dr-chart__table">
        <div
          v-for="(it,i) in forRender.datasets"
          class="dr-chart__table-item"
          :key="it.label"
          :style="{backgroundColor: color[i]}"
        >
          <span class="dr-chart__table-label">{{ it.label }}</span>
          <span class="dr-chart__table-value">{{(it.data[index] ? it.data[index] : 0) + ' МВт' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Line } from 'vue-chartjs/src'

  export default {
    extends: Line,
    props: {
      chartParams: {
        type: Object
      }
    },

    data() {
      return {
        forRender: null,
        color: ['#063B87', '#fa3159', '#23a051', 'grey', 'yellow'],
        index: 0,
        buttons: []
      }
    },

    created() {
      this.forRender = { ...this.chartParams }
      this.forRender.datasets = this.forRender.datasets.reduce((acc, it) => {
        it.data.indexOf(null) < 0 ? acc.push(it) : false
        return acc
      }, [])
      this.buttons = this.forRender.labels.map((it, i) => {
        if (i === 0) return { label: it, active: true }
        return { label: it }
      })
      this.forRender.datasets.map((it, i) => {
        it.borderColor = this.color[i]
        it.pointBackgroundColor = this.color[i]
        it.pointRadius = 3
      })
    },

    mounted() {
      this.renderChart(this.forRender, { responsive: true, maintainAspectRatio: false })
    },

    methods: {
      selectedHandler(val) {
        this.buttons.map(it => {
          it.active = false
        })
        val.active = true
        this.index = this.chartParams.labels.findIndex(it => it === val.label)
      },
    }
  }
</script>

<style lang="scss" scoped>
  .dr-chart {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: $white;
    z-index: 1000;

    &__wrap {
      width: 100%;
      margin-top: 40px;
    }

    &__close {
      @include flexAlign(center, center);
      position: fixed;
      width: 40px;
      height: 40px;
      background: $classicBlue;

      &-icon {
        color: $white;
      }
    }

    &__info {
      width: 440px;
      max-width: 90%;
      margin: 0 auto;
    }

    &__buttons {
      @include flexAlign(center, center);
      width: 100%;
    }

    &__btn {
      @include flexAlign(center, center);
      @include fontExo($classicBlue, 14px);
      width: 50px;
      height: 50px;
      border: 1px solid $classicBlue;
      border-radius: 5px;
      margin: 10px 5px;
    }

    &__table {
      &-item {
        @include flexAlign(center, space-between);
        @include fontExo($white, 14px);
        padding: 10px 4px;
        border-radius: 3px;
        margin-top: 5px;
      }
    }
  }

  .active {
    border: none;
    color: $white;
  }

</style>
