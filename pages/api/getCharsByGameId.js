import prisma from "../../prisma/client";

 async function getCharsByGameId(req, res) {
     const charsByGameId = await prisma.characterStatsThatChange.findMany({
        where: req.query
      });
    res.json(charsByGameId);
}

export default getCharsByGameId