
import { createConnection, getManager } from "typeorm";
import { Permission } from "../entity/permission.entity";
import { Role } from "../entity/role.entity";

createConnection().then(async connection => {

    const permissionRepository = getManager().getRepository(Permission);

    const permissions = [
        "view_users",
        "edit_users",
        "view_roles",
        "edit_roles",
        "view_products",
        "edit_products",
        "view_products",
        "edit_products"
    ];
    let permission = [];

  for(let i =0; i< permissions.length; i++){
   
     permission.push(await permissionRepository.save({
            name:permissions[i]
      }));
  }

  const roleRepository = getManager().getRepository(Role);
  await roleRepository.save({
        name:"Admin",
        permissions:permission
    });
 
    await roleRepository.save({
        name:"Editor",
        permissions:permission.slice(0,2)
    });

    await roleRepository.save({
        name:"Viewer",
        permissions:permission.slice(0,1)
    });

    process.exit(0);

})