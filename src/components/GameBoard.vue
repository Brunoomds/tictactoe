<template>
	<div class="w-full grid grid-cols-3 gap-2">
		<button
			v-for="(boardSlot, index) in store.boardSlots"
			@click.prevent="store.handleMove(index)"
			class="bg-slate-800 w-full aspect-square flex justify-center items-center rounded transition-all duration-300 sm:hover:bg-slate-700"
			:class="[
				{ 'pointer-events-none': boardSlot || store.hasWinner },
				{ 'pointer-events-none opacity-50': store.loadingBotPlay },
			]"
		>
			<component
				:is="boardSlot"
				class="w-1/2 transition-opacity duration-300"
				:class="[
					{ 'animate-pulse-fast': store.hasWinner?.includes(index) },
					{ 'opacity-10': (store.hasWinner && !store.hasWinner.includes(index)) || store.isTie },
				]"
			/>
		</button>
	</div>
</template>

<script setup>
import { useGameStore } from "@/stores/game";

const store = useGameStore();
</script>
