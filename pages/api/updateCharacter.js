import prisma from "../../prisma/client";

export default async function updateCharStats(req, res) {
  const { charName, currentFp, currentEp, currentPp, currentMp, currentLp, atkRollResult,
    atkRollResultAfter5sec, skillCheckResult, skillCheckResultAfter5sec, atkRollDice,
    atkRollDiceAfter5sec, skillCheckDice, skillCheckDiceAfter5sec, activeBuffs, numberOfActions, gameId} = req.body;
     const characterStats = await prisma.characterStatsThatChange.update({
        where: { charName },
        data: { currentFp, currentEp, currentPp, currentMp, currentLp, atkRollResult,
          atkRollResultAfter5sec, skillCheckResult, skillCheckResultAfter5sec, atkRollDice,
          atkRollDiceAfter5sec, skillCheckDice, skillCheckDiceAfter5sec, activeBuffs, numberOfActions, gameId }
      });
    res.json(characterStats);
}