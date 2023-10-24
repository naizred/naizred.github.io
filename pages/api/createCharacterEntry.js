import prisma from "../../prisma/client";

const newCharStats = async (req, res) => {
  try {
    const existingCharacter = await prisma.characterStatsThatChange.findUnique({
      where: { charName: req.body.charName },
    });

    if (existingCharacter) {
      return res.status(400).json({ error: 'Character name already exists' });
    }

    const newCharacterStats = await prisma.characterStatsThatChange.create({
      data: {
        charName: req.body.charName,
        currentFp: req.body.currentFp,
        currentEp: req.body.currentEp,
        currentLp: req.body.currentLp,
        currentPp: req.body.currentPp,
        currentMp: req.body.currentMp
      },
    });

    res.status(200).json(newCharacterStats);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default newCharStats;