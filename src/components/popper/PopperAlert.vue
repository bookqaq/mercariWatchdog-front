<template>
    <div>
        <div class="alert alert-dismissible" :class="msgtype" role="alert">
            {{message}}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click.prevent="emit('close', false)"></button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    msgtype: {
        type: String, 
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['close']);

</script>

<style lang="scss" scoped>

</style>