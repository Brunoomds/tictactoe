<template>
	<div class="grid grid-cols-3 gap-2">
		<a
			href="https://github.com/brunomdsilva/tictactoe"
			target="_blank"
			class="p-2 mr-auto hover:text-slate-200 transition-colors duration-300"
		>
			<IconGithub class="w-6" />
		</a>

		<div class="bg-slate-800 py-2 px-4 rounded font-semibold">
			<div v-if="isRoundOver" class="flex justify-center items-center gap-2 animate-pulse-fast">
				<component :is="slots[winnerSlots[0]] || IconMarkX" class="w-4" />
				<p v-text="winnerSlots.length ? 'WINS' : 'TIE'" class="text-white" />
				<component :is="slots[winnerSlots[0]] || IconMarkO" class="w-4" />
			</div>

			<div v-else class="flex justify-center items-center gap-2">
				<component :is="xTurn ? IconMarkX : IconMarkO" class="w-4" />
				<p>TURN</p>
			</div>
		</div>

		<div class="flex justify-end gap-2">
			<button
				@click.prevent="$emit('clearBoard')"
				class="bg-slate-800 aspect-square rounded hover:bg-slate-700 transition-colors duration-300"
			>
				<IconReload class="w-4 mx-auto" />
			</button>
		</div>
	</div>
</template>

<script setup>
import IconReload from "@/components/icons/IconReload.vue";
import IconGithub from "@/components/icons/IconGithub.vue";
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
	winnerSlots: {
		type: Array,
		required: true,
	},
});
</script>
