
import prisma from "../../../prisma/client";

const weaponByNameEn = async (req, res) => {
  
    const dataen =await prisma.ttkweaponsen.findFirst({
      where: req.query,
  });
    
  res.status(200).json(dataen);
};

export default weaponByNameEn;