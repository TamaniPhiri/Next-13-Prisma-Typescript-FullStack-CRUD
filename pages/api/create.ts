import {prisma} from '@/lib/prisma'
import { NextApiRequest,NextApiResponse } from 'next'
 
export default async function handler(req: NextApiRequest,res: NextApiResponse){
    const{title,description} = req.body
    try {
        await prisma.notes.create({
            data:{
                title,
                description
            }
        })
        res.status(200).json({message:"Note created successfully"})
    } catch (error) {
        res.json({error: error})
        console.log(error);
        
    }
}