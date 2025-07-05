<script setup lang="ts">
import { getDataFromUrl } from "@/core/get-image-data-from-url";
import type { InputImageValue } from "@/types/InputImageValue";
import { onMounted, ref, type PropType } from "vue";

const props = defineProps({
    modelValue: {
        type: Object as PropType<InputImageValue>,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    defaultImage: {
        type: String,
        required: true,
    },
});

const emit = defineEmits<{
    (e: "update:modelValue", value: InputImageValue): void;
}>();

(async function (imgUrl: string) {
    const imageData = await getDataFromUrl(imgUrl);
    emit("update:modelValue", {
        imageData: imageData,
        imgUrl: imgUrl,
    });
})(props.defaultImage);

const dimage = ref<HTMLImageElement>();
const fileupload = ref<HTMLInputElement>();

onMounted(() => {
    if (dimage.value == null) throw new Error("Init error: dimage is not set");
    if (fileupload.value == null) throw new Error("Init error: fileupload is not set");

    dimage.value.draggable = false;
});

function dImageDragOver(e: Event) {
    dimage.value!.classList.add("drophover");
    e.preventDefault();
    return false;
}

function dImageDragStop() {
    dimage.value!.classList.remove("drophover");
    return false;
}

async function readFileAsDataUrl(file: File): Promise<string> {
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
        reader.onload = function (event) {
            resolve(event.target!.result as string);
        };
        reader.addEventListener("error", () => reject(), { once: true });
        reader.readAsDataURL(file);
    });
}

async function fileUploadChange(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    const file = fileupload.value!.files![0];
    if (file != undefined) {
        const imgUrl = await readFileAsDataUrl(file);
        const imageData = await getDataFromUrl(imgUrl);
        emit("update:modelValue", {
            imageData: imageData,
            imgUrl: imgUrl,
        });
    } else {
        console.error("Select a image from your computer");
    }
    return false;
}

// watch(
//     () => props.modelValue.imageUrl,
//     (newValue) => {
//         if (dimage.value!.src != newValue) dimage.value!.src = newValue;
//     },
// );

// function dImageLoad() {
//     if (props.modelValue.imageUrl != dimage.value!.src)
//         emit("update:modelValue", { imageUrl: dimage.value!.src });
// }

async function dImageOnDrop(e: Event) {
    if (!(e instanceof DragEvent)) throw new Error("Wrong type of event");
    dimage.value!.classList.remove("drophover");
    e.preventDefault();

    const file = e.dataTransfer!.files[0];
    if (file != undefined) {
        const imgUrl = await readFileAsDataUrl(file);
        const imageData = await getDataFromUrl(imgUrl);
        emit("update:modelValue", {
            imageData: imageData,
            imgUrl: imgUrl,
        });
    } else {
        console.error("Drag a image from your computer");
    }
    return false;
}
</script>

<template>
    <div class="col-md-6 text-center">
        <p>{{ label }}</p>
        <img
            class="img"
            ref="dimage"
            @dragover="dImageDragOver"
            @dragleave="dImageDragStop"
            @dragend="dImageDragStop"
            @drop="dImageOnDrop"
            alt=""
            :src="modelValue.imgUrl"
        />
        <br />
        <label>
            <input
                type="file"
                style="display: none"
                ref="fileupload"
                class="form-control form-control-sm"
                @change="fileUploadChange($event)"
                accept="image/*"
            />
            <span class="btn btn-secondary" v-if="modelValue.imgUrl === defaultImage"
                >Select file</span
            >
            <span class="btn btn-secondary" v-else>Change</span>
        </label>
    </div>
</template>
