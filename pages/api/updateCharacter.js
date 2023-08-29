import prisma from "../../prisma/client";

export default async function updateCharStats(req, res) {
  const { charName, currentFp, currentEp, currentPp, currentMp, currentLp } = req.body;
     const characterStats = await prisma.characterStatsThatChange.update({
        where: { charName },
        data: { currentFp, currentEp, currentPp, currentMp, currentLp }
      });
    res.status(200).json(characterStats);
}