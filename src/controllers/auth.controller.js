import User from "../model/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
export const register=async(req ,res , next)=>{
    try {
        const{email,password,name}= req.body;
        if(!email || !password)
        {
            return res.status(400).json(
                {
                    message:"email and password required",
                    success:false
                }
            )
        }
        const exists = await User.findOne({email});
        if(exists)
        {
            return res.status(400).json(
                {
                    message:"email already register",
                    success:false
                }
            )
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password:hashed
           
        })
        return res.status(200).json(
            {
                message:"register successfully",
                id:user._id,
                name: user.name,
                email:user.email,
              
            }
        )
    } catch (error) {
       next(error);
        
    }
}

export const login=async(req ,res,next)=>{
    try {
        const{email,password}=req.body;

         if(!email || !password)
        {
            return res.status(400).json(
                {
                    message:"email and password required",
                    success:false
                }
            )
        }
        const user = await User.findOne({email});
        if(!user)
        {
            return res.status(400).json(
                {
                    message:"Invalid credential",
                    success:false
                }
          
            )
        }

        const ok = await bcrypt.compare(password,user.password);
        if(!ok)
            {
                return res.status(400).json(
                    {
                        message:"Invalid credential",
                        success:false
                    }
              
                )
            }
        
            const token= jwt.sign( { id: user._id, email: user.email },
                process.env.JWT_SECRET,             
            { expiresIn: process.env.JWT_EXPIRE});

                return res.json({
                    message:"user login succesfully",
                    token,
                    user:{
                        id:user._id,
                        email:user.email,
                        name:user.name
                    }
                });

    } catch (error) {
        next(error);
        
    }

}