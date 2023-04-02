<template>
	<div class="h-screen bg-slate-900 flex justify-center items-center p-4">
		<div class="w-full max-w-lg space-y-6">
			<!-- HEADER -->
			<div>
				<button @click.prevent="clearBoard()">Reset</button>
			</div>

			<!-- BOARD -->
			<div class="w-full grid grid-cols-3 gap-2">
				<button
					v-for="(mark, index) in slots"
					@click.prevent="handlePlay(index)"
					class="bg-slate-800 w-full aspect-square flex justify-center items-center"
					:class="{ 'pointer-events-none': mark || !canPlay }"
				>
					<component
						:is="mark"
						class="w-1/2"
						:class="{ 'animate-pulse-fast': highlightSlots.includes(index) }"
					/>
				</button>
			</div>

			<!-- SCORES -->
			<div class="w-full grid grid-cols-3 gap-2 text-2xl text-slate-900 text-center font-bold">
				<div class="bg-teal-400 p-2">
					{{ scores.x }}
				</div>
				<div class="bg-slate-700 p-2">{{ scores.tie }}</div>
				<div class="bg-yellow-500 p-2">
					{{ scores.o }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import IconMarkX from "./components/icons/IconMarkX.vue";
import IconMarkO from "./components/icons/IconMarkO.vue";

const slots = ref(Array(9).fill(null));
const xTurn = ref(true);
const canPlay = ref(true);
const scores = ref({
	x: 0,
	tie: 0,
	o: 0,
});
const winSlots = ref([
	// VERTICALS
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	// HORIZONTALS
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	// DIAGONALS
	[0, 4, 8],
	[2, 4, 6],
]);
const highlightSlots = ref([]);

function handlePlay(index) {
	if (slots.value[index] || !canPlay.value) return;

	slots.value[index] = xTurn.value ? IconMarkX : IconMarkO;

	checkResult();

	xTurn.value = !xTurn.value;
}

function checkResult() {
	for (let i = 0; i < winSlots.value.length; i++) {
		const [a, b, c] = winSlots.value[i];
		const hasWinner = slots.value[a] && slots.value[a] === slots.value[b] && slots.value[a] === slots.value[c];
		if (hasWinner) {
			xTurn.value ? scores.value.x++ : scores.value.o++;
			canPlay.value = false;
			highlightSlots.value = winSlots.value[i];
		}
	}

	const isTie = slots.value.every((slot) => slot !== null);
	if (isTie) {
		scores.value.tie++;
		canPlay.value = false;
		highlightSlots.value = slots.value.map((_, index) => index);
	}
}

function clearBoard() {
	slots.value = Array(9).fill(null);
	canPlay.value = true;
	highlightSlots.value = [];
}
</script>
