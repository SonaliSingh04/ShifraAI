import User from '../Models/user.models.js'

export const getCurrentUser = async (req, res) =>{
  try{
    const user = await User.findById(req.userID)
    if(!user){
        return res.status(404).json({message: "failed to get current user"})
    }
    return res.status(200).json(user)
  }catch(error){
    return res.status(500).json({message: `getCurrentUser error ${error}`})
  }
}