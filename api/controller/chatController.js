export default class chatController {

    constructor({ AppModel }) {
      this.Model1 = AppModel.chatModel;
      this.Model2 = AppModel.userModel;
    }
  
    get_chats = async (req, res) => {
      const user = req.user;
  
      const result = await this.Model1.get_chats({ userId: user.id });
  
      if (result.success) {
        return res.status(200).json({ chats: result.chats, success: true });
      } else {
        return res.status(404).json({ error: result.error, success: false });
      }
    }

    create = async (req,res)=>{
        const user = req.user;
        const {username} = req.params

        const result1 = await this.Model2.exist({username:username})
        if(!result1){
    
          return res.status(404).json({error:"Usuario no encontrado",success:false})
        }

        const result2 = await this.Model1.createChat({userId1:user.id, userId2:result1.id})

        if(result2.success){
            return res.status(201).json({message:"Chat creado",success:true})
        }else{
            return res.status(401).json({error:result2.error,success:false})
        }
    }
  
  }
  