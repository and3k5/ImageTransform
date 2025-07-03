<script setup lang="ts">
import { onMounted, ref } from "vue";
import InputImage from "./components/InputImage.vue";
import { type InputImageValue } from "./types/InputImageValue";
import { algos } from "./core/algorithms";
import { createConvertor } from "./core/it";
import { useColorMode } from "./color-mode-store";
import { useConverterState } from "./core/converter-state";

const progress = ref<number>();

const converterState = useConverterState();

const CONVERTOR = createConvertor((n) => {
    if (n != null) {
        if (progress.value != Math.round(n * 1000) / 1000) {
            progress.value = Math.round(n * 1000) / 1000;
        }
    } else {
        progress.value = n;
    }
});

const imageValue1 = ref<InputImageValue>({
    imageData: null!,
});

const imageValue2 = ref<InputImageValue>({
    imageData: null!,
});

const canvasContainer = ref<HTMLDivElement>();

const algorithms = ref<HTMLSelectElement>();
const colorMode = useColorMode();

onMounted(() => {
    algos.forEach(function (algo) {
        const option = new Option();
        option.value = algo.id;
        option.textContent = algo.name;
        //console.log("Added algo: " + algo.name);
        algorithms.value!.add(option);
    });
});

function startConvert() {
    if (canvasContainer.value == null) throw new Error("canvasContainer is missing");
    const canv1 = document.createElement("canvas");
    canv1.addEventListener("click", () => {
        CONVERTOR.render();
    });
    while (canvasContainer.value.children[0])
        canvasContainer.value.removeChild(canvasContainer.value.children[0]);
    canvasContainer.value.appendChild(canv1);
    // <canvas id="canv1" ref="canv1" @click="CONVERTOR.render()"></canvas>
    CONVERTOR.CONVERT(
        algorithms.value!.value,
        canv1,
        imageValue1.value.imageData,
        imageValue2.value.imageData,
    );
}
</script>

<template>
    <main class="container py-3">
        <div class="card row">
            <header class="card-header d-flex justify-content-between px-3">
                <div>
                    <a href="/">
                        <span class="fs-4">ImageTransform</span>
                    </a>
                </div>
                <div class="btn-group" role="group" aria-label="Theme">
                    <button
                        type="button"
                        :class="{
                            'btn btn-outline-secondary': true,
                            active: colorMode.userPreference === undefined,
                        }"
                        @click="colorMode.setDarkMode(undefined)"
                    >
                        <i class="bi bi-gear"></i>
                    </button>
                    <button
                        type="button"
                        :class="{
                            'btn btn-outline-secondary': true,
                            active: colorMode.userPreference === false,
                        }"
                        @click="colorMode.setDarkMode(false)"
                    >
                        <i class="bi bi-sun"></i>
                    </button>
                    <button
                        type="button"
                        :class="{
                            'btn btn-outline-secondary': true,
                            active: colorMode.userPreference === true,
                        }"
                        @click="colorMode.setDarkMode(true)"
                    >
                        <i class="bi bi-moon"></i>
                    </button>
                </div>
            </header>
            <div class="card-body">
                <p>Select an image or use the example</p>
                <div class="container rounded-3">
                    <div class="row align-items-md-stretch">
                        <div class="col-md-6">
                            <select
                                class="form-select form-select-lg mb-3"
                                id="algoritms"
                                ref="algorithms"
                            ></select>
                            <div class="row">
                                <InputImage
                                    label="Select image 1"
                                    v-model="imageValue1"
                                    default-image="/default-image-1.png"
                                ></InputImage>
                                <InputImage
                                    label="Select image 2"
                                    v-model="imageValue2"
                                    default-image="/default-image-2.png"
                                ></InputImage>
                            </div>
                        </div>
                        <div class="col-md-6 text-center">
                            <button
                                v-if="converterState.inProgress"
                                type="button"
                                class="btn btn-lg btn-danger w-100 mb-3"
                                @click="CONVERTOR.stopConvert()"
                            >
                                Stop
                            </button>
                            <button
                                v-else
                                type="button"
                                class="btn btn-lg btn-primary w-100 mb-3"
                                id="btn"
                                @click="startConvert"
                            >
                                Calculate
                            </button>
                            <progress
                                v-if="progress != null"
                                class="w-100"
                                style="height: 2em"
                                min="0"
                                max="1"
                                :value="progress"
                            ></progress>
                            <p class="text-center">Result</p>
                            <div ref="canvasContainer"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <a href="http://github.com/and3k5/ImageTransform/">Project on GitHub</a>
            </div>
        </div>
    </main>
</template>

<style scoped>
header {
    line-height: 1.5;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }
}
</style>
