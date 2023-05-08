import prisma from "../../prisma/client";

const newWeapon = async (req, res) => {
   await prisma.ttkweapons.create({
    
        data: {
          w_name: req.body.w_name,
          w_damage: req.body.w_damage,
          w_type: req.body.w_type
       },
  });
    
  res.status(200);
};

export default newWeapon;