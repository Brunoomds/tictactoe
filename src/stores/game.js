import { defineStore } from "pinia";
import { computed, markRaw, ref } from "vue";
import IconMarkX from "@/components/icons/IconMarkX.vue";
import IconMarkO from "@/components/icons/IconMarkO.vue";

export const useGameStore = defineStore("game", () => {
	// STATE
	const boardSlots = ref(Array(9).fill(null));
	const playerTurn = ref(true);
	const toggleFirstTurn = ref(!playerTurn.value);
	const loadingBotPlay = ref(false);
	const scores = ref({ x: 0, o: 0 });

	const winCombs = [
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
	];

	// GETTERS
	const hasWinner = computed(() => {
		const board = boardSlots.value;
		return winCombs.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
	});

	const isTie = computed(() => boardSlots.value.every((slot) => slot));

	// ACTIONS
	function resetBoard() {
		boardSlots.value = Array(9).fill(null);

		playerTurn.value = toggleFirstTurn.value;
		toggleFirstTurn.value = !toggleFirstTurn.value;

		if (!playerTurn.value) handleBotMove();
	}

	function switchTurn() {
		playerTurn.value = !playerTurn.value;
		if (!playerTurn.value) handleBotMove();
	}

	function handleMove(index) {
		if (boardSlots.value[index] || hasWinner.value) return;

		boardSlots.value.splice(index, 1, playerTurn.value ? markRaw(IconMarkX) : markRaw(IconMarkO));

		if (hasWinner.value) playerTurn.value ? scores.value.x++ : scores.value.o++;
		if (!hasWinner.value && !isTie.value) switchTurn();
	}

	function handleBotMove() {
		loadingBotPlay.value = true;
		const bestMove = getBestMove(boardSlots.value, playerTurn.value).index;

		setTimeout(() => {
			loadingBotPlay.value = false;
			handleMove(bestMove);
		}, 600);
	}

	function getBestMove(board, isMaximizing, alpha = -Infinity, beta = Infinity) {
		const availableSlots = board.reduce((acc, slot, index) => (slot === null ? [...acc, index] : acc), []);

		const hasWinner = winCombs.some(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);

		if (hasWinner) return { score: isMaximizing ? -10 : +10 };
		if (!availableSlots.length) return { score: 0 };

		let bestMove = { score: isMaximizing ? -Infinity : Infinity };

		for (const slot of availableSlots) {
			board[slot] = isMaximizing ? markRaw(IconMarkX) : markRaw(IconMarkO);

			const score = getBestMove(board, !isMaximizing, alpha, beta).score;

			board[slot] = null;

			if (isMaximizing && score > bestMove.score) {
				bestMove = { index: slot, score };
				alpha = Math.max(alpha, score);
			}
			if (!isMaximizing && score < bestMove.score) {
				bestMove = { index: slot, score };
				beta = Math.min(beta, score);
			}

			if (alpha >= beta) break;
		}

		return bestMove;
	}

	// EXPORT
	return { boardSlots, playerTurn, hasWinner, isTie, scores, loadingBotPlay, handleMove, resetBoard };
});
