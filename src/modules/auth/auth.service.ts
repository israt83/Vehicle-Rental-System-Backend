import bcrypt from "bcryptjs";
import { pool } from "../../database/db";
import jwt from "jsonwebtoken"
import config from "../../config";

const signupUser = async (payload : Record<string , any>) =>{
  const { name, email, password, phone, role  } = payload;

  const hashedPassword = await bcrypt.hash(password as string, 10);
   
  const result = await pool.query(`
    INSERT INTO users (name , email , password , phone , role) VALUES ($1 , $2 , $3 , $4 , $5) RETURNING *
    ` , [name , email , hashedPassword , phone , role]);
    delete result.rows[0].password

  return result

  

}

const loginUser = async(email : string , password : string)=>{

const result = await pool.query(`
  SELECT * FROM users WHERE email = $1
` , [email])

if(result.rows.length === 0){
  throw new Error('Invalid credentials')
}

const user = result.rows[0];

const matchPassword = await bcrypt.compare(password , user.password)

if(!matchPassword){
  throw new Error('Invalid credentials')
}

const secret = config.jwtSecret;

const token = jwt.sign({
  id : user.id,
  email : user.email,
  role : user.role
} , secret as string,{
   expiresIn: "7d"
})

delete user.password;

return {token,user }
   
}

export const authService = {
  signupUser,
  loginUser
}