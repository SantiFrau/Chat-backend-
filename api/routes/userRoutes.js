import { Router} from "express";
import userController from "../controller/userController.js";
import { validateToken } from "../middleware/validateToken.js";



export default function createUserRoutes({AppModel}){

    const router = Router()
    const user_controller = new userController({AppModel:AppModel})
    

    router.post("/register", user_controller.register)
    router.post("/login", user_controller.login)

    router.get("/search",validateToken,user_controller.get_users) //params ?search=""
    router.get("/",validateToken,user_controller.get_my_user)
    
    


    return router
}