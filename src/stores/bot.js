// function handleBotPlay() {
// 	const bestMove = minimax(slots.value, xTurn.value).index;
// 	loadinBotPlay.value = true;

// 	setTimeout(() => {
// 		loadinBotPlay.value = false;
// 		handlePlay(bestMove);
// 	}, 600);
// }

// function minimax(board, isMaximizing, alpha = -Infinity, beta = Infinity) {
// 	const availableSlots = board.reduce((acc, slot, index) => (slot === null ? [...acc, index] : acc), []);

// 	if (checkWinner(board, xTurn.value)) return { score: -10 };
// 	if (checkWinner(board, !xTurn.value)) return { score: 10 };
// 	if (availableSlots.length === 0) return { score: 0 };

// 	let bestMove = { score: isMaximizing ? -Infinity : Infinity };

// 	for (const slot of availableSlots) {
// 		board[slot] = isMaximizing ? markRaw(IconMarkX) : markRaw(IconMarkO);

// 		const { score } = minimax(board, !isMaximizing, alpha, beta);

// 		board[slot] = null;

// 		if (isMaximizing && score > bestMove.score) {
// 			bestMove = { index: slot, score };
// 			alpha = Math.max(alpha, score);
// 		} else if (!isMaximizing && score < bestMove.score) {
// 			bestMove = { index: slot, score };
// 			beta = Math.min(beta, score);
// 		}

// 		if (alpha >= beta) break;
// 	}

// 	return bestMove;
// }

// function checkWinner(board, isMaximizing) {
// 	const player = isMaximizing ? markRaw(IconMarkX) : markRaw(IconMarkO);
// 	return store.winCombinations.some(([a, b, c]) => board[a] === player && board[b] === player && board[c] === player);
// }
