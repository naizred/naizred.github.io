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
  } = req.body;

  const currentStats = await prisma.characterStatsThatChange.findFirst({
    where: { charName },
  });

  const dataToUpdate = {}

  if (parseInt(currentStats.currentFp) !== parseInt(currentFp)) dataToUpdate.currentFp = currentFp;
  if (currentStats.currentEp !== currentEp) dataToUpdate.currentEp = currentEp;
  if (currentStats.currentPp !== currentPp) dataToUpdate.currentPp = currentPp;
  if (currentStats.currentMp !== currentMp) dataToUpdate.currentMp = currentMp;
  if (currentStats.currentLp !== currentLp) dataToUpdate.currentLp = currentLp;
  if (currentStats.atkRollResult !== atkRollResult) dataToUpdate.atkRollResult = atkRollResult;
  if (currentStats.skillCheckResult !== skillCheckResult) dataToUpdate.skillCheckResult = skillCheckResult;
  if (currentStats.atkRollDice !== atkRollDice) dataToUpdate.atkRollDice = atkRollDice;
  if (currentStats.skillCheckDice !== skillCheckDice) dataToUpdate.skillCheckDice = skillCheckDice;
  if (currentStats.activeBuffs !== activeBuffs) dataToUpdate.activeBuffs = activeBuffs;
  if (currentStats.numberOfActions !== numberOfActions) dataToUpdate.numberOfActions = numberOfActions;
  if (currentStats.gameId !== gameId) dataToUpdate.gameId = gameId;
  if (currentStats.initiativeWithRoll !== initiativeWithRoll) dataToUpdate.initiativeWithRoll = initiativeWithRoll;

let dataToUpdateKeys = Object.keys(dataToUpdate)

let dataToUpdateForSelect = {}

  for (let i = 0; i < dataToUpdateKeys.length; i++) {
    if (dataToUpdate[dataToUpdateKeys[i]]) {
      dataToUpdateForSelect[dataToUpdateKeys[i]] = true;
    }
  }
  if (!Object.keys(dataToUpdateForSelect).length) {
    res.status(200).json({ message: "No changes to update" });
  } else if (dataToUpdateKeys.length > 0) {
    const updatedCharacterStats = await prisma.characterStatsThatChange.update({
      where: { charName },
      select: dataToUpdateForSelect,
      data: dataToUpdate,
    });
    res.json(updatedCharacterStats);
  }
}
