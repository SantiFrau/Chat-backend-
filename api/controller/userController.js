import { userRegisterSchema } from '../schemas/user.js';
import { userLoginSchema } from "../schemas/user.js"

export default class userController {

  constructor({ AppModel }) {
    this.Model = AppModel.userModel;
  }

  register = async (req, res) => {
    const result = userRegisterSchema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return res.status(400).json({ error: errors, success: false });
    }

    const r = await this.Model.register({ data: result.data });

    if (r.success) {
      return res.status(201).json({ token: r.token, success: true });
    } else {
      return res.status(409).json({ error: r.error || "No se pudo registrar el usuario", success: false });
    }
  }

  login = async (req, res) => {
    const result = userLoginSchema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return res.status(400).json({ error: errors, success: false });
    }

    const { username, password } = result.data;
    const r = await this.Model.login({ username, password });

    if (r.success) {
      return res.status(200).json({ token: r.token, success: true });
    } else {
      return res.status(401).json({ error: r.error || "Credenciales inválidas", success: false });
    }
  }

  get_my_user = async (req, res) => {
    
    const user = req.user;
    return res.status(200).json({ username:user.username,img:user.img, success: true });
  }

  get_users = async (req, res) => {
    
    const search = req.query.search;  
    const excludeId = req.user.id;

    const result = await this.Model.get_users({ search, excludeId });

    if (result.success) {
      return res.status(200).json({ users: result.users, success: true });
    } else {
      return res.status(404).json({ error: "No se ha encontrado el usuario", success: false });
    }
  }
}

