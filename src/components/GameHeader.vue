<template></template>

<script setup>
import IconMarkX from "@/components/icons/IconMarkX.vue";
import IconMarkO from "@/components/icons/IconMarkO.vue";

const props = defineProps({
	slots: {
		type: Array,
		required: true,
	},
	xTurn: {
		type: Boolean,
		required: true,
	},
	isRoundOver: {
		type: Boolean,
		required: true,
	},
	winResultSlots: {
		type: Array,
		required: true,
	},
});
</script>
