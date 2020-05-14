<template>
  <div class="dr-chart">
    <div class="dr-chart__close" @click="$emit('close-chart')">
      <i class="material-icons dr-chart__close-icon">close</i>
    </div>
    <div class="chart-wrap">
      <canvas width="500" ref="canvas"></canvas>
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
				color: ['blue', 'red', 'green', 'grey', 'yellow']
			}
		},

		created() {
			this.forRender = { ...this.chartParams }
			this.forRender.datasets.map((it, i) => it.borderColor = this.color[i])
		},

		mounted() {
			this.renderChart(this.forRender, { responsive: true, maintainAspectRatio: false })
		}
	}
</script>

<style lang="scss">
  .dr-chart {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: $white;
    z-index: 1000;

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
  }

  .chart-wrap {
    width: 100%;
    position: absolute;
    top: 5%;
  }
</style>
