import { Router} from "express";
import chatController from "../controller/chatController.js";
import { validateToken } from "../middleware/validateToken.js";
import messageController from "../controller/messageController.js";



export default function createChatsRoutes({AppModel}){

    const router = Router()
    const chat_controller = new chatController({AppModel:AppModel})
    const message_controller = new messageController ({AppModel:AppModel})
    
    router.get("/",validateToken,chat_controller.get_chats)

    router.post("/create/:username",validateToken,chat_controller.create)

    router.get("/message/:chatId",validateToken,message_controller.GetMessages)
    
    


    return router
}