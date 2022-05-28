<script setup>
import { reactive, ref } from "@vue/reactivity";
import { computed, onMounted } from "@vue/runtime-core";
import ButtonSelector from "./ButtonSelector.vue";
import PopperAlert from "../popper/PopperAlert.vue";

const submitURL = "https://merbot-api.bookq.xyz/task/submit"

const props = defineProps({
    taskAddSettings: {
        type: Object,
        required: true
    },
    auth: {
        type: String,
        required: true
    }
});

const SubmitProcessing = ref(false);

const alertControl = reactive({
    message: "",
    type: "",
    visible: false,
});

function alert(message, type) {
    alertControl.message = message,
    alertControl.type = "alert-" + type,
    alertControl.visible = true;
}

const TaskAddFormData = reactive({
    keywords_orig: "",
    keywords: null,
    group: null,
    mustMatch: [],
    owner: null,
    interval: 3600,
    targetPrice:[-1, 0], 
    maxPage: 1,
});

const KeywordsSplitter = computed(() => {
    if (TaskAddFormData.keywords_orig == "") {
        return null;
    }
    let kwtmp = TaskAddFormData.keywords_orig,
        mustMatchtmp = TaskAddFormData.mustMatch;
    let kwarr = kwtmp.trim(" ").replace(/\uff0c/g, " ").split(" ").filter(x => (x != ""));

    mustMatchtmp = mustMatchtmp.filter(v => kwarr.findIndex(i => i == v) >= 0);

    TaskAddFormData.mustMatch = mustMatchtmp;
    TaskAddFormData.keywords = kwarr;
    return kwarr;
});

const ListenButtonResponse = (res) => {
    let seltmp = TaskAddFormData.mustMatch;
    if (res.selected && TaskAddFormData.keywords_orig.indexOf(res.text) != -1) {
        seltmp.push(res.text);
    } else if (!res.selected) {
        seltmp = seltmp.filter(v => v != res.text);
    }
    TaskAddFormData.mustMatch = seltmp;
};

// eslint-disable-next-line vue/no-setup-props-destructure
const fetchedSettings = props.taskAddSettings;
onMounted(() => {
    Object.keys(fetchedSettings.override).forEach(key => {
        TaskAddFormData[key] = fetchedSettings.override[key];
    });
});

async function TaskSubmit() {
    SubmitProcessing.value = true;
    await fetch(submitURL, {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({auth: props.auth,data: TaskAddFormData})
    }).then(response => {
        if (response.status >= 400) {
            throw "服务器连接失败了，请私聊告诉我这个问题，非常感谢！";
        }
        return response.json();
    })
    .then(data => {
        alert(data.message, data.status == "success" ? "success" : "warning");
    }).catch(err => alert(err, "danger"));
    SubmitProcessing.value = false;
}

</script>

<template>
    <div class="container">
        <form>
            <div class="col align-self-center">
                <div class="mb-3">
                    <PopperAlert v-if="alertControl.visible" 
                    :message="alertControl.message" :msgtype="alertControl.type" 
                    @close="v => alertControl.visible = v" />
                </div>
            </div>
            <div class="col align-self-center">
                <div class="mb-3">
                    <label for="owner" class="form-label">号主QQ</label>
                    <input type="text" class="form-control" id="owner" :placeholder="TaskAddFormData.owner" disabled required>
                </div>
            </div>
            <div class="col align-self-center">
                <div class="mb-3">
                    <label for="keyword" class="form-label">关键词{{TaskAddFormData.keywords}} {{TaskAddFormData.mustMatch}}</label>
                    <input type="text" class="form-control" id="Keyword" v-model="TaskAddFormData.keywords_orig" required>
                    <div class="form-text">请使用半角空格或中文逗号进行分隔</div>
                </div>
            </div>
            <div class="col align-self-center">
                <div class="mb-3">
                    <label for="" class="form-label">必须包含的关键词</label>
                    <div class="mb-3">
                        <div class="btn-group" role="group">
                            <ButtonSelector v-for="ks in KeywordsSplitter" :key="ks" :text="ks" @response="(s) => ListenButtonResponse(s)"/>
                        </div>
                    </div>
                    <div class="form-text">如果有更好的小标题请私聊告诉我</div>
                </div>
            </div>
            <div class="col align-self-center">
                <div class="mb-3">
                    <label for="interval" class="form-label">搜索间隔</label>
                    <select class="form-select form-select mb-3" aria-label=".form-select-lg example" id="interval" v-model="TaskAddFormData.interval">
                        <option mustMatch disabled>请选择间隔</option>
                        <option v-for="interval in fetchedSettings.settings.interval" :value="interval.time" :key="interval.time">{{interval.text}}</option>
                    </select>
                </div>
            </div>
            <div class="col align-self-center">
                <div class="mb-3">
                    <label for="minPrice" class="form-label">价格区间</label>
                    <div class="input-group mb-3">
                        <input type="number" class="form-control" v-model.number="TaskAddFormData.targetPrice[0]" placeholder="最低价" aria-label="最低价" min="-1" required>
                        <span class="input-group-text">~</span>
                        <input type="number" class="form-control" v-model.number="TaskAddFormData.targetPrice[1]" placeholder="最高价" aria-label="最高价" min="0" required>
                    </div>
                    <div class="form-text">不修改该默认值则不限制价格</div>
                </div>
            </div>
            <div class="col align-self-center">
                <div class="mb-3">
                    <label for="maxpage" class="form-label">搜索页数</label>
                    <input type="number" class="form-control" id="maxpage" required
                        v-model.number="TaskAddFormData.maxPage" 
                        :min="fetchedSettings.settings.pageRange[0]" 
                        :max="fetchedSettings.settings.pageRange[1]">
                    <div class="form-text">限制为{{fetchedSettings.settings.pageRange[0]}}~{{fetchedSettings.settings.pageRange[1]}}</div>
                </div>
            </div>
            <div class="col align-self-center">
                <div class="mb-3">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="advancedOptions" disabled>
                        <label class="form-check-label" for="advancedOptions">高级设置(摸了)</label>
                    </div>
                </div>
            </div>
            <div class="col align-self-center">
                <div class="d-grid gap-2">
                        <button class="btn btn-primary" type="submit" @click.prevent="TaskSubmit" :disabled="SubmitProcessing">提交</button>
                </div>
            </div>
        </form>
    </div>
</template>

<style lang="sass" scoped>


</style>