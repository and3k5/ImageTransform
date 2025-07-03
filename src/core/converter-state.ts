import { defineStore } from "pinia";
import { ref } from "vue";

export const useConverterState = defineStore("converter", () => {
    const inProgress = ref(false);

    return { inProgress };
});
