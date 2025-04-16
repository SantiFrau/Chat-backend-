import { Router} from "express";
import chatController from "../controller/chatController";



export default function createChatsRoutes({AppModel}){

    const router = Router()
    const chat_controller = new chatController({AppModel:AppModel})
    
    router.get("/",chat_controller.get_chats)

    
    
    


    return router
}