import { Request, Response } from "express"
import { vehicleService } from "./vehicles.service"

const addVehicles = async(req: Request , res : Response)=>{
        try {
            const result = await vehicleService.addVehicles(req.body);
            return res.status(201).json({
                success : true,
                message : 'Vehicles created successfully',
                data : result.rows[0]
            })
            
        } catch (error : any) {
            return res.status(500).json({
                success : false,
                message : error.message
            })
        }
}

const getVehicles = async(req : Request , res : Response) =>{
   try {
    const result = await vehicleService.getVehicles();
    if(result.rows.length === 0){
        return res.status(200).json({
            success : true,
            message : 'No vehicles found',
            data : result.rows
        })
    }
   return res.status(200).json({
    success : true,
    message : 'Vehicles retrieved successfully',
    data : result.rows
   })
   } catch (error : any) {
       return res.status(500).json({
           success : false,
           message : error.message
       })
   }
}
const getSingleVehicle = async(req : Request , res : Response) =>{
        try {
            const vehicleId = Number(req.params.vehicleId);
            const result = await vehicleService.getSingleVehicle(vehicleId)
            if(result.rows.length === 0){
                return res.status(404).json({
                    message : 'Vehicle not found'
                })
            }
            return res.status(200).json({
                success : true,
                message : 'Vehicle retrieved successfully',
                data : result.rows[0]
            })
            
        } catch (error:any) {
            return res.status(500).json({
                success : false,
                message : error.message
            })
        }
}

const updateVehicle = async(req : Request , res : Response) =>{
    try {
        const vehicleId = Number(req.params.vehicleId);
        const result = await vehicleService.updateVehicle(req.body, vehicleId)

        if(result.rows.length === 0){
            return res.status(404).json({
                message : 'Vehicle not found'
            })
        }

        return res.status(200).json({
            success : true,
            message : 'Vehicle updated successfully',
            data : result.rows[0]
        })
        
    } catch (error : any) {
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

const deleteVehicle = async(req : Request , res : Response) =>{
    try {

        const vehicleId = Number(req.params.vehicleId);
        
        const reult = await vehicleService.deleteVehicle(vehicleId);

        return res.status(200).json({
            success : true,
            message : 'Vehicle deleted successfully',
            
        })
        
    } catch (error : any) {
        return res.status(500).json({
            success : false,
            message : error.message
        })
        
    }
}

export const vehicleController = {
    addVehicles,
    getVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle
}