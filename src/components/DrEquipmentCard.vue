<template>
  <div class="dr-equipment">
    <div class="dr-equipment__stats">
      <span class="dr-equipment__text">{{ item.name }}</span>
      <v-checkbox color="#ffffff" :isChecked="item.ready" label="готов" :disabled="true"/>
      <span class="dr-equipment__sub" v-if="item.consumers">
        {{ item.consumers ? item.consumers.name : '' }}
      </span>
      <span class="dr-equipment__sub" v-if="item.reductionVolume">
        {{ item.reductionVolume ? item.reductionVolume : '' }}
      </span>
    </div>
    <div
      v-if="item.ready && dateParams.isFinished"
      class="dr-equipment__btn"
      @click="$emit('open-chart',{type: 'equipment', uid: item.uid})"
    >
      <i class="material-icons dr-equipment__btn-icon">show_chart</i>
    </div>
  </div>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				required: true
			},
			dateParams: {
				type: Object,
				required: true
			}
		}
	}
</script>

<style lang="scss" scoped>
  .dr-equipment {
    @include flexAlign(center, space-between);
    width: 100%;
    flex-wrap: wrap;
    border-radius: 3px;
    padding: 10px;
    margin: 5px 0;

    &__stats {
      @include flexAlign(center, space-between);
      flex-wrap: wrap;
      width: 100%;
      padding: 5px 0;
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
</style>
