<template>
    <main>
        <TaskAddForm v-if="fetchedData.done" :taskAddSettings="fetchedData.data" :auth="route.params.auth"/>
    </main>
</template>

<script setup>
import TaskAddForm from '../components/taskadd/TaskAddForm.vue';
import { useRoute } from 'vue-router'
import { reactive } from '@vue/reactivity';

const route = useRoute();
const fetchedData = reactive({
    data: null,
    done: false
})

const settingURL = "https://merbot-api.bookq.xyz/task/fetch"

// https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
// https://stackoverflow.com/questions/5234581/base64url-decoding-via-javascript
//function b64DecodeUnicode(str) {
//    // Going backwards: from bytestream, to percent-encoding, to original string.
//    return decodeURIComponent(atob(str).split('').map(function(c) {
//        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//    }).join(''));
//}

async function fetchSettings() {
    await fetch(settingURL, {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "auth=" + route.params.auth,
    }).then((response) => response.json())
    .then((data) => {
        if (data.status == "failed") {
            console.log(data);
            throw "Failed exit because of auth failure";
        }
        fetchedData.data = data.data;
        fetchedData.done = true;
    })
    .catch((err) => {
        console.log(err);
    });
}

fetchSettings()

</script>

<style lang="scss" scoped>

</style>