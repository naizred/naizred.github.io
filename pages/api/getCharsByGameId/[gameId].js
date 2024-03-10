import prisma from "../../../prisma/client";

const getCharsByGameId = async (req, res) => {
  let gameIdNumber = Object.values(req.query)[0];
  const data = await prisma.characterStatsThatChange.findMany({
    where: { gameId: gameIdNumber },
  });

  res.status(200).json(data);
};

export default getCharsByGameId;
