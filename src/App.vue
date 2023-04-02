<template>
	<div class="relative min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
		<div class="w-full max-w-lg space-y-6">
			<GameHeader v-bind="{ slots, xTurn, isRoundOver, winnerSlots }" @clear-board="clearBoard()" />

			<GameBoard v-bind="{ slots, xTurn, isRoundOver, winnerSlots }" @user-move="userMove($event)" />

			<GameScore v-bind="{ scores }" />
		</div>
	</div>
</template>

<script setup>
import { markRaw, ref, watchEffect } from "vue";
import IconMarkX from "@/components/icons/IconMarkX.vue";
import IconMarkO from "@/components/icons/IconMarkO.vue";
import GameHeader from "./components/GameHeader.vue";
import GameBoard from "./components/GameBoard.vue";
import GameScore from "./components/GameScore.vue";

const slots = ref(Array(9).fill(null));
const xTurn = ref(true);
const toggleFirstMove = ref(!xTurn.value);
const isRoundOver = ref(false);
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

function userMove(index) {
	if (slots.value[index] || isRoundOver.value || !xTurn.value) return;
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

	return setTimeout(() => handlePlay(bestMove), 0);

	const randomChance = Math.random() < 0.1;

	setTimeout(() => handlePlay(randomChance ? randomMove : bestMove), 600);
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
	if (!xTurn.value && !isRoundOver.value) handleBotPlay();
});
</script>
