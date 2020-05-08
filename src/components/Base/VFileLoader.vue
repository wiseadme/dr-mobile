<template>
  <div class="v-file-loader">
    <input v-if="isClear" @change="fileLoader" name="images" ref="input" type="file" multiple hidden>
    <div class="v-file-loader__field" @click="$refs.input.click()">
      <i class="material-icons">attach_file</i>
      <span class="v-file-loader__label">{{label}}</span>
    </div>

    <transition-group name="fadeIn" tag="div" move-class="move" class="v-file-loader__chips-box">
      <div v-for="it in files" :key="it.name" class="v-file-loader__chip">
        <span class="v-file-loader__chip-file">{{it.name}}</span>
        <i @click="removeFile(it)" class="material-icons v-file-loader__chip-del">cancel</i>
      </div>
    </transition-group>
  </div>
</template>

<script>
	export default {
		name: 'VFileLoader',
		props: {
			label: {
				type: String,
				required: true
			}
		},
		data() {
			return {
				files: [],
				isClear: true
			}
		},
		methods: {
			fileLoader(e) {
				const files = e.target.files
				if (this.files.length + files.length > 12) {
					return this.$emit('limit')
				}
				Array.prototype.forEach.call(files, it => {
					if (this.files.find(t => t.name === it.name)) return
					this.files.push(it)
				})
				this.isClear = false
				this.$emit('input', this.files)
				setTimeout(() => this.isClear = true)
			},
			removeFile(file) {
				this.files.splice(this.files.indexOf(file), 1)
			}
		}
	}
</script>

<style lang="scss">
  .v-file-loader {
    width: 100%;
    height: auto;
    &__field {
      @include flexAlign(center, center);
      @include fontExo($blue, .8em);
      position: relative;
      width: 100%;
      height: 52px;
      border-radius: 3px;
      border: 2px dotted $blue;
      cursor: pointer;
    }
    &__chips-box {
      @include flexAlign(center, flex-start);
      width: 100%;
      height: auto;
      min-height: 70px;
      flex-wrap: wrap;
      border: 2px dotted $blue;
      border-radius: 3px;
      margin: 10px 0;
    }
    &__chip {
      @include fontExo($white, .8em);
      @include flexAlign(center, space-between);
      border-radius: 20px;
      background: $blue;
      min-width: 75px;
      box-shadow: $boxShadow;
      padding: 5px;
      margin: 5px;
      &-file {
        margin: 0 5px;
      }
      &-del {
        cursor: pointer;
        /*margin: 0 5px;*/
      }
    }
  }
  .move {
    transition: all .5s;
  }
</style>