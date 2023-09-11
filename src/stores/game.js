import { defineStore } from "pinia";
import { ref } from "vue";

export const useGameStore = defineStore("game", () => {
	// STATE
	const slots = ref(Array(9).fill(null));
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

	// ACTIONS
	function setScore(xTurn) {
		xTurn ? scores.value.x++ : scores.value.o++;
	}

	// EXPORT
	return { scores, winCombinations, setScore };
});
