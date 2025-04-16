import { Router} from "express";
import userController from "../controller/userController";



export default function createUserRoutes({AppModel}){

    const router = Router()
    const user_controller = new userController({AppModel:AppModel})
    

    router.post("/register", user_controller.register)
    router.post("/login", user_controller.login)
    
    


    return router
}