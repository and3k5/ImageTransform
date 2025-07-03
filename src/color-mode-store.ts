import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { matchDark, setDarkModeOnDocument } from "./color-mode";

export const useColorMode = defineStore("color-mode", () => {
    const darkMatcher = matchDark;
    const browserPreferDark = ref(darkMatcher.matches);
    darkMatcher.addEventListener("change", (e) => {
        browserPreferDark.value = e.matches;
    });

    const userOption = ref<boolean | undefined>();

    const preferDark = computed(() => {
        return userOption.value ?? browserPreferDark.value;
    });

    watch(
        () => preferDark.value,
        (newValue) => {
            setDarkModeOnDocument(newValue);
        },
        {
            immediate: true,
        },
    );

    return {
        setDarkMode(enabled: boolean | undefined) {
            userOption.value = enabled;
        },
        darkMode: preferDark,
        userPreference: userOption,
    };
});
