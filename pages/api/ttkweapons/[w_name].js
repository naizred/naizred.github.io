
import prisma from "../../../prisma/client";

const weaponByName = async (req, res) => {
  
    const data =await prisma.ttkweapons.findFirst({
      where: req.query,
  });
    
  res.status(200).json(data);
};

export default weaponByName;