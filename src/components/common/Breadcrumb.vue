<template>
    <div class='oneName'>
        <h2>{{oneName}}</h2>
    </div>
</template>
   
   
<script>
import Bus from './bus.js'
export default {
    data() {
        return {
        }
    },
    created() {
    },
    methods: {
        
    },
    props: {
        oneName: {
            type: [String],
            default: '商城概况'
        },
    },
    beforeDestroy () {
    }
}
</script>
   
<style scoped lang='scss'>
.oneName{
    h2{
        font-size: 16px;
        color: #333;
    }
} 
</style>