import { defineStore } from "pinia";
import { computed, markRaw, ref } from "vue";
import IconMarkX from "@/components/icons/IconMarkX.vue";
import IconMarkO from "@/components/icons/IconMarkO.vue";

export const useGameStore = defineStore("game", () => {
	// STATE
	const boardSlots = ref(Array(9).fill(null));
	const playerTurn = ref(true);
	const toggleFirstTurn = ref(!playerTurn.value);
	const scores = ref({ x: 0, o: 0 });
	const winCombinations = [
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
		return winCombinations.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
	});

	const isTie = computed(() => boardSlots.value.every((slot) => slot));

	// ACTIONS
	function handleMove(index) {
		if (boardSlots.value[index] || hasWinner.value) return;

		boardSlots.value.splice(index, 1, playerTurn.value ? markRaw(IconMarkX) : markRaw(IconMarkO));

		if (hasWinner.value) setScore(playerTurn.value);

		if (!hasWinner.value && !isTie.value) playerTurn.value = !playerTurn.value;
	}

	function resetBoard() {
		boardSlots.value = Array(9).fill(null);

		playerTurn.value = toggleFirstTurn.value;
		toggleFirstTurn.value = !toggleFirstTurn.value;
	}

	function setScore() {
		playerTurn.value ? scores.value.x++ : scores.value.o++;
	}

	// EXPORT
	return { boardSlots, playerTurn, hasWinner, isTie, scores, handleMove, resetBoard };
});
