<template>
	<div class="w-full grid grid-cols-3 gap-2">
		<button
			v-for="(slot, index) in slots"
			@click.prevent="if (xTurn) $emit('handlePlay', index);"
			class="bg-slate-800 w-full aspect-square flex justify-center items-center rounded transition-colors duration-300 sm:hover:bg-slate-700"
			:class="{ 'pointer-events-none': slot || isRoundOver || !xTurn }"
		>
			<component
				:is="slot"
				class="w-1/2 transition-opacity duration-300"
				:class="[
					{ 'animate-pulse-fast': winnerSlots.includes(index) },
					{ 'opacity-10': isRoundOver && !winnerSlots.includes(index) },
				]"
			/>
		</button>
	</div>
</template>

<script setup>
const props = defineProps({
	slots: {
		type: Array,
		required: true,
	},
	xTurn: Boolean,
	isRoundOver: Boolean,
	winnerSlots: Array,
});
</script>
