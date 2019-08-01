<template>
  <input :type="inputType"
         readonly
         :class="classStyle"
         @click="btnClick($event)"
         :disabled="classStyle==='disabled-btn'"
         :value="text">
</template>
<script>
  export default {
    props: {
      text: {
        type: [String, Number],
        default: '一颗小按钮'
      },
      inputType: {
        type: [String],
        default: 'button'
      },
      classStyle: {
        type: String,
        default: 'default-btn'
      }
    },
    methods: {
      btnClick (event) {
        this.$emit('btnClick', event)
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/css/_variable.scss";

  %style {
    // width: 100px;
    height: 32px;
    line-height: 30px;
    vertical-align: middle;
    text-align: center;
    padding: 0 20px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  @mixin color($a,$b,$c) {
    border: 1px solid $a;
    border-radius: 2px;
    font-size: 12px;
    color: $b;
    background-color: $c;
  }

  input {
    display: inline-block;
    cursor: pointer;
    text-align: center;
  }

  /*白底的按钮*/
  .white-btn {
    border: 1px solid #d5d5d5;
    color: #646464;
  }

  // 白底的按钮
  .white-btn {
    @include color(#fff, $main-col, #fff);
    @extend %style;
  }
  // 默认按钮
  .default-btn {
    @include color($main-col, $main-col, #fff);
    @extend %style;
    // background-image: -webkit-linear-gradient(top, $cf, #f9f9f9);
    // background-image: linear-gradient(180deg, $cf, #f9f9f9);
    // &:hover {
    //   background-color: #eee;
    //   background-image: -webkit-linear-gradient(top, #f5f5f5, #eee);
    //   background-image: linear-gradient(180deg, #f5f5f5, #eee);
    // }
  }

  // 主色按钮
  .main-btn {
    @include color($main-col, #fff, $main-col);
    @extend %style;
    // background-image: -webkit-linear-gradient(top, #678ee7, #5078df);
    // background-image: linear-gradient(180deg, #678ee7, #5078df);
    // &:hover {
    //   background-color: #6c8cd4;
    //   background-image: -webkit-linear-gradient(top, #6c8cd4, #4769c2);
    //   background-image: linear-gradient(180deg, #6c8cd4, #4769c2);
    // }
  }

  // 禁用
  .disabled-btn {
    cursor: not-allowed;
    @include color(#afafaf, $cf, #a9a9a9);
    @extend %style;
    // background-image: -webkit-linear-gradient(top, #b8b8b8, #a9a9a9);
    // background-image: linear-gradient(180deg, #b8b8b8, #a9a9a9);
  }

</style>
