import { chooseAiMove } from "./search";
import type { Game } from "../types/game";
import type { AiDifficulty } from "./types";
self.onmessage = (
  event: MessageEvent<{ game: Game; difficulty: AiDifficulty }>,
) => {
  const easy = event.data.difficulty === "easy";
  self.postMessage(
    chooseAiMove(event.data.game, {
      maxDepth: easy ? 1 : 3,
      maxNodes: easy ? 2000 : 16000,
      timeMs: easy ? 350 : 1400,
    }),
  );
};
