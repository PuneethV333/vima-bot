import { Request, Response } from "express";
import { getError } from "../utils/error.utils";
import { searchVideoOnYT } from "../tools/youtube.tools";
import { searchVideoSchema } from "../types/tools.types";

export const searchVideo = async (req:Request,res:Response) => {
    try {
        const parsed = searchVideoSchema.safeParse(req.body)
        if (!parsed.success){
            console.log(parsed.error);
            
            return res.status(400).json({
                message:"which video ??"
            })
        }
        console.log(parsed);
        
        const data = await searchVideoOnYT(parsed.data.query)
        
        
        
        return res.status(200).json({
            id:data[0].id.videoId
        })
    } catch (err) {
        res.status(500).json(getError(err))
    }
}