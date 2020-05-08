<template>
  <div @click="clickHandler" ref="card" :class="['card', {confirmed, rejected}]">
    <div class="card-left">
      <div class="card__text">
        <span
          class="card__text-item"
          v-if="item.name || item.senderName">
          {{ item.name ? item.name : item.senderName ? `сообщение от ${item.senderName}` : ''}}
        </span>
        <span class="card__text-item">
          {{
            item.login ? item.login : item.text ? item.text : ''
          }}
        </span>
        <span class="card__text-item inn" v-if="item.inn">{{ 'инн: ' + item.inn }}</span>
        <span class="card__text-item date" v-if="item.createdDate">
          {{ item.statusCode ? 'дата регистрации: ' + formattedDate : 'уведомление получено: ' + formattedDate }}
        </span>
        <div class="custom" v-if="item.textCustom">
          {{ item.textCustom }}
        </div>
      </div>
      <div class="card__buttons" v-if="(okButton || cancelButton) && !confirmed && !rejected">
        <div v-if="okButton" @click="approve" class="card__buttons-confirm">{{ okButton }}</div>
        <div v-if="cancelButton" @click="reject" class="card__buttons-reject">{{ cancelButton }}</div>
      </div>
      <div :class="['card__status',
    {'card__status-confirmed': confirmed, 'card__status-rejected': rejected}]"
           v-else
      >
        {{ statusMessage }}
      </div>
      <div class="card__message" v-if="item.comment || item.text && item.senderName" @click="openComment">
        <i class="material-icons card__message-icon">email</i>
      </div>
    </div>
    <div class="card-right">
      <div class="card__head">
        <img class="card__head-image" src="../assets/images/logo-white.svg" alt="">
        <span class="card__head-text">{{ infoHead }}</span>
      </div>
      <div class="card__info">
        <i class="material-icons card__info-icon">{{ icon }}</i>
      </div>
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
      confirmMessage: {
        type: String
      },

      rejectMessage: {
        type: String
      },

      okButton: {
        type: [String, Boolean]
      },

      cancelButton: {
        type: String
      },

      infoHead: {
        type: String,
        required: true
      },

      icon: {
        type: String,
        default: 'email'
      }
    },

    data() {
      return {
        statusMessage: '',
        confirmed: false,
        rejected: false
      }
    },

    created() {

    },

    methods: {
      openComment() {
        if (this.item.senderName) {
          this.$emit('open-comment', this.item.text)
        } else {
          this.$emit('open-comment', this.item.comment)
        }
      },

      approve() {
        this.$emit('approve', { item: this.item, flag: true })
      },

      reject() {
        this.$emit('reject', { item: this.item, flag: false })
      },

      clickHandler() {
        this.$emit('click', this.item)
      }
    },

    computed: {
      formattedDate() {
        return this.$moment(this.item.createdDate).format('LLLL')
      }
    }
  }
</script>

<style lang="scss">
  .card {
    @include fontNun($darkBlue, 1em);
    @include flexAlign(flex-start, center);
    width: 450px;
    min-height: 170px;
    max-width: 90%;
    background: $white;
    margin: 10px 0;
    border-radius: 5px;
    box-shadow: $boxShadowLite;
    overflow: hidden;

    &-left {
      position: relative;
      width: 70%;
      height: 100%;
      padding: 10px;
      @include flexAlign(center, center, column);
    }

    &-right {
      width: 30%;
      min-height: 100%;
      background: $classicBlue;
    }

    &__text {
      width: 100%;
      margin: auto;
      @include flexAlign(flex-start, flex-start, column);

      &-item {
        @include fontExo($darkBlue, 14px);
        margin: 5px 0;

        &:nth-child(1) {
          font-weight: 900;
        }
      }
    }

    &__message {
      @include flexAlign(center, center);
      position: absolute;
      right: 10px;
      top: 10px;
      width: 40px;
      height: 40px;
      border-radius: 50px;
      background: $classicBlue;
      box-shadow: $boxShadow;
      cursor: pointer;

      &-icon {
        color: $white;
      }
    }

    &__buttons {
      @include flexAlign(center, flex-start);
      width: 100%;
      margin: 10px;

      &-confirm {
        color: $classicBlue;
        padding: 5px 10px;
        border: 1px solid $classicBlue;
        border-radius: 3px;
        margin-right: 20px;
      }

      &-reject {
        color: $classicGold;
        padding: 5px 10px;
        border: 1px solid $classicGold;
        border-radius: 3px;
      }
    }

    &__status {
      width: 100%;
      text-align: center;
      padding: 5px;
      color: $white;
      border-radius: 3px;

      &-confirmed {
        color: $classicBlue
      }

      &-rejected {
        color: $classicGold
      }
    }

    &__head {
      @include flexAlign(center, space-evenly);
      padding: 5px;
      width: 100%;

      &-image {
        width: 25px;
      }

      &-text {
        @include fontNun($white, 10px);
      }
    }

    &__info {
      @include flexAlign(center, center);
      width: 100%;
      min-height: 100px;

      &-icon {
        color: $white;
        font-size: 40px !important;
      }
    }
  }

  .confirmed, .rejected {
    box-shadow: none;
    opacity: .5;
  }

  .status-item {
    color: $classicBlue;
    font-size: 12px;
    font-weight: 800;
  }

  .inn, .date {
    font-size: 12px;
  }

  @media screen and(max-width: 414px) {
    .card {

      &-left {

      }

      &-right {

      }

      &__text {
        &-item {
          font-size: 12px;
          margin: 5px 0;

          &:nth-child(1) {
            font-weight: 900;
          }
        }
      }

      &__head {
        &-text {
          @include fontNun($white, 8px);
        }
      }

      &__buttons {
        @include flexAlign(center, flex-start);
        width: 100%;

        &-confirm {
          font-size: 12px;
          color: $classicBlue;
          padding: 5px 7px;
          margin-right: 10px;
        }

        &-reject {
          font-size: 12px;
          color: $classicGold;
          padding: 5px 7px;
        }
      }
    }
    .status-item {
      font-size: 10px;
    }
  }
</style>
