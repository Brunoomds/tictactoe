<template>
	<div class="relative min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
		<div class="w-full max-w-lg space-y-6 transition-opacity duration-300">
			<GameHeader />
			<GameBoard />
			<GameScore />
		</div>
	</div>
</template>

<script setup>
import GameHeader from "@/components/GameHeader.vue";
import GameBoard from "@/components/GameBoard.vue";
import GameScore from "@/components/GameScore.vue";
import { useGameStore } from "@/stores/game";

const store = useGameStore();
</script>
