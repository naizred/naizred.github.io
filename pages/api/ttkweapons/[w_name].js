

import { PrismaClient } from "@prisma/client";

const weaponByName = async (req, res) => {
  const prisma = new PrismaClient()
console.log(req.query)
    const data =await prisma.ttkweapons.findFirst({
      where: req.query,
  });
    
  res.status(200).json(data);
};

export default weaponByName;