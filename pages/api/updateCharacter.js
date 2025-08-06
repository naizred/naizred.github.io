import prisma from "../../prisma/client";

export default async function updateCharStats(req, res) {
  const {
    charName,
    currentFp,
    currentEp,
    currentPp,
    currentMp,
    currentLp,
    atkRollResult,
    skillCheckResult,
    atkRollDice,
    skillCheckDice,
    activeBuffs,
    numberOfActions,
    gameId,
    initiativeWithRoll,
    currentBloodPoints,
    combatLog,
    notes,
  } = req.body;
  const characterStats = await prisma.characterStatsThatChange.update({
    where: { charName },
    data: {
      currentFp,
      currentEp,
      currentPp,
      currentMp,
      currentLp,
      atkRollResult,
      skillCheckResult,
      atkRollDice,
      skillCheckDice,
      activeBuffs,
      numberOfActions,
      gameId,
      initiativeWithRoll,
      currentBloodPoints,
      combatLog,
      notes,
    },
  });
  res.json(characterStats);
}
