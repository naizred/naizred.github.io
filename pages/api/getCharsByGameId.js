import prisma from "../../prisma/client";

const getCharsByGameId = async (req, res) => {
  let gameId = req.query.gameId;
  const entryUpdateTimeAtRequestTime = parseInt(req.query.entryUpdateTimeAtRequestTime); // Expects a timestamp from the client
  let dateFromEntryUpdateTimeAtRequestTime = new Date(entryUpdateTimeAtRequestTime)
  dateFromEntryUpdateTimeAtRequestTime = dateFromEntryUpdateTimeAtRequestTime.toISOString()
  try {
    if (!entryUpdateTimeAtRequestTime) {
      const data = await prisma.characterStatsThatChange.findMany({
        where: {
          gameId: gameId,
        },
        orderBy: { updatedAt: 'asc' } // Ensure consistent order by update time
      });
      res.status(200).json(data);
    } else {
      const data = await prisma.characterStatsThatChange.findMany({
        where: {
          gameId: gameId,
          updatedAt: { gt: dateFromEntryUpdateTimeAtRequestTime }, 
        },
        orderBy: { updatedAt: 'asc' } // Ensure consistent order by update time
      });
      res.status(200).json(data);
    }

    } catch (error) {
        console.error('Error fetching characters:', error);
        res.status(500).json({ error: 'Error fetching character stats' });
    }
}

export default getCharsByGameId;