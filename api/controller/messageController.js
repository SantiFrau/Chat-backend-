
export default class messageController{

    constructor({ AppModel }) {
        this.Model = AppModel.messageModel;
      }

      InsertMessage = async ({message,chatId,userId})=>{
        
        /*{
            description:string
            mine:bool
            date:date
        }*/ 
       
        const response = await this.Model.InsertMessage({data:message.description,chatId,userId,date:message.date})
        
        if(response.success){
            return {success:true,message:"Mensaje insertado"}
        }else{
            return {success:false,error:response.error}
        }
        
      }

      GetMessages = async (req,res)=>{
         
        const {chatId} = req.params
        console.log("a")
        
        const response = await this.Model.GetMessages({chatId,userId:req.user.id})
        console.log(response)
        if(response.success){
            res.status(200).json(response)
        }else{
            res.status(404).json({error:response.error})
        }

      }
}
