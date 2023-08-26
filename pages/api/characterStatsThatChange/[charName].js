import prisma from "../../../prisma/client";

const charByName = async (req, res) => {
    const data = await prisma.characterStatsThatChange.findFirst({
      where: req.query,
  });
    
  res.status(200).json(data);
};

export default charByName;