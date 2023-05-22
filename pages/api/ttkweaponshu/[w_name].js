
import prisma from "../../../prisma/client";

const weaponByNameHu = async (req, res) => {
  
    const datahu =await prisma.ttkweaponshu.findFirst({
      where: req.query,
  });
    
  res.status(200).json(datahu);
};

export default weaponByNameHu;