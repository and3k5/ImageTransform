<script setup lang="ts">
import { onMounted, ref } from "vue";
import InputImage from "./components/InputImage.vue";
import { type InputImageValue } from "./types/InputImageValue";
import { algos } from "./core/algorithms";
import { createConvertor } from "./core/it";

const CONVERTOR = createConvertor();

const imageValue1 = ref<InputImageValue>({
    imageData: null!,
});

const imageValue2 = ref<InputImageValue>({
    imageData: null!,
});

const canv1 = ref<HTMLCanvasElement>();

const algorithms = ref<HTMLSelectElement>();

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
    CONVERTOR.CONVERT(
        algorithms.value!.value,
        canv1.value!,
        imageValue1.value.imageData,
        imageValue2.value.imageData,
    );
}
</script>

<template>
    <main class="container py-3">
        <div class="card row">
            <header class="card-header">
                <a href="/">
                    <span class="fs-4">ImageTransform</span>
                </a>
            </header>
            <div class="card-body">
                <p>Select an image or use the example</p>
                <div class="container rounded-3">
                    <div class="row align-items-md-stretch">
                        <div class="col-md-6">
                            <select
                                class="form-control input-lg"
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
                                type="button"
                                class="btn btn-primary form-control input-lg py-2"
                                id="btn"
                                @click="startConvert"
                            >
                                Calculate
                            </button>
                            <p class="text-center">Result</p>
                            <canvas id="canv1" ref="canv1" @click="CONVERTOR.render()"></canvas>
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
