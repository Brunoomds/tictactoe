<template>
	<div class="relative min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
		<div class="w-full max-w-lg space-y-6">
			<!-- HEADER -->
			<div class="grid grid-cols-3 gap-2">
				<a href="https://github.com/brunoomds" target="_blank" class="p-2 mr-auto hover:text-slate-200">
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
						@click.prevent="clearBoard()"
						class="bg-slate-800 aspect-square rounded hover:bg-slate-700 transition-colors duration-300"
					>
						<IconReload class="w-4 mx-auto" />
					</button>
				</div>
			</div>

			<!-- BOARD -->
			<div class="w-full grid grid-cols-3 gap-2">
				<button
					v-for="(slot, index) in slots"
					@click.prevent="userMove(index)"
					class="bg-slate-800 w-full aspect-square flex justify-center items-center rounded transition-colors duration-300 sm:hover:bg-slate-700"
					:class="{ 'pointer-events-none': slot || isRoundOver || isBotTurn }"
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

			<!-- SCORES -->
			<div class="flex justify-center gap-4 font-semibold text-xl">
				<div class="flex items-center justify-end gap-2 w-full">
					<p>You</p>
					<IconMarkX class="w-4 fill-slate-400" />
					<p v-text="scores.x" />
				</div>
				<p class="font-bold">-</p>
				<div class="flex items-center gap-2 w-full">
					<p v-text="scores.o" />
					<IconMarkO class="w-4 fill-slate-400" />
					<p>Bot</p>
				</div>
			</div>
		</div>

		<div class="absolute left-8 bottom-8 p-3 bg-slate-800 text-left space-y-3">
			<p>isRoundOver: {{ isRoundOver }}</p>
			<p>winnerSlots: {{ winnerSlots }}</p>
			<p>xTurn: {{ xTurn }}</p>
			<p @click.prevent="botMode = !botMode">botMode: {{ botMode }}</p>
			<p>botTurn: {{ isBotTurn }}</p>
		</div>
	</div>
</template>

<script setup>
import { markRaw, ref, watchEffect } from "vue";
import IconMarkX from "@/components/icons/IconMarkX.vue";
import IconMarkO from "@/components/icons/IconMarkO.vue";
import IconReload from "@/components/icons/IconReload.vue";
import IconGithub from "@/components/icons/IconGithub.vue";
import { computed } from "@vue/reactivity";

const slots = ref(Array(9).fill(null));
const xTurn = ref(true);
const toggleFirstMove = ref(true);
const isRoundOver = ref(false);
const botMode = ref(true);
const winnerSlots = ref([]);

const scores = ref({ x: 0, o: 0 });

const winCombinations = ref([
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

const isBotTurn = computed(() => botMode.value && !xTurn.value);

function userMove(index) {
	if (slots.value[index] || isRoundOver.value || isBotTurn.value) return;
	handlePlay(index);
}

function handlePlay(index) {
	slots.value[index] = xTurn.value ? markRaw(IconMarkX) : markRaw(IconMarkO);

	for (const [a, b, c] of winCombinations.value) {
		const hasWinner = slots.value[a] && slots.value[a] === slots.value[b] && slots.value[a] === slots.value[c];
		if (hasWinner) {
			xTurn.value ? scores.value.x++ : scores.value.o++;
			winnerSlots.value.push(a, b, c);
			return (isRoundOver.value = true);
		}
	}

	const isTie = slots.value.every((slot) => slot !== null);
	if (isTie) return (isRoundOver.value = true);

	xTurn.value = !xTurn.value;
}

function clearBoard() {
	slots.value.fill(null);
	winnerSlots.value = [];
	isRoundOver.value = false;

	xTurn.value = toggleFirstMove.value;
	toggleFirstMove.value = !toggleFirstMove.value;
}

function handleBotPlay() {
	const avaiableSlots = slots.value.reduce((acc, slot, index) => (slot === null ? [...acc, index] : acc), []);
	const randomMove = avaiableSlots[Math.floor(Math.random() * avaiableSlots.length)];
	const bestMove = minimax(slots.value, xTurn.value).index;

	const randomChance = Math.random() < 0.1;
	if (randomChance) console.log("random move");

	setTimeout(() => handlePlay(randomChance ? randomMove : bestMove), 0);
}

function minimax(board, isMaximizing, alpha = -Infinity, beta = Infinity) {
	const availableSlots = board.reduce((acc, slot, index) => (slot === null ? [...acc, index] : acc), []);

	if (checkWinner(board, xTurn.value)) return { score: -10 };
	if (checkWinner(board, !xTurn.value)) return { score: 10 };
	if (availableSlots.length === 0) return { score: 0 };

	let bestMove = { score: isMaximizing ? -Infinity : Infinity };

	for (const slot of availableSlots) {
		board[slot] = isMaximizing ? markRaw(IconMarkX) : markRaw(IconMarkO);

		const { score } = minimax(board, !isMaximizing, alpha, beta);

		board[slot] = null;

		if (isMaximizing && score > bestMove.score) {
			bestMove = { index: slot, score };
			alpha = Math.max(alpha, score);
		} else if (!isMaximizing && score < bestMove.score) {
			bestMove = { index: slot, score };
			beta = Math.min(beta, score);
		}

		if (alpha >= beta) break;
	}

	return bestMove;
}

function checkWinner(board, isMaximizing) {
	const player = isMaximizing ? markRaw(IconMarkX) : markRaw(IconMarkO);
	return winCombinations.value.some(([a, b, c]) => board[a] === player && board[b] === player && board[c] === player);
}

watchEffect(() => {
	if (isBotTurn.value && !isRoundOver.value) handleBotPlay();
});
</script>
