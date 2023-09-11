import { defineStore } from "pinia";
import { ref } from "vue";

export const useGameStore = defineStore("game", () => {
	// STATE
	const scores = ref({ x: 0, o: 0 });

	// ACTIONS
	function setScore(xTurn) {
		xTurn ? scores.value.x++ : scores.value.o++;
	}

	// EXPORT
	return { scores, setScore };
});
