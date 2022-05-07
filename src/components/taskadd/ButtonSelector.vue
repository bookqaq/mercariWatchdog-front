<script setup>
import { reactive, ref } from "@vue/reactivity";
const prop = defineProps({
    text: {
        type: String,
        required: true
    },
})

const emit = defineEmits(['response'])

const param = {
    pressed: [ref(false), ref(true)],
    btnOnClickCallback: () => {
        param.pressed[0].value = param.pressed[0].value == true ? false : true;
        param.pressed[1].value = !param.pressed[0].value;
        emit('response', {text: prop.text, selected: param.pressed[0].value})
    },
};

const data = {
    btn: {
        class: reactive({
            "btn": true, 
            "btn-primary": param.pressed[0],
            "btn-secondary": param.pressed[1],
            }),
    },
};

emit('response', {text: prop.text, selected: param.pressed[0].value})
</script>

<template>
    <button :class="data.btn.class" @click.prevent="param.btnOnClickCallback">{{ prop.text }}</button>
</template>

<style lang="scss" scoped>

</style>