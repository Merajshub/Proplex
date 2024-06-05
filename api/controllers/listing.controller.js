import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing=async(req,res,next)=>{
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
       
        
    } catch (error) {
        next(error);
    }
};
export const deleteListing = async (req,res,next)=>{
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(404,'Listing not found'));
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401,'you can only delete your own listings'));
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing deleted successfully!');
        
    } catch (error) {
        next(error)
        
    }
}
export const updateListing = async(req,res,next)=>{
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(404,'Listing not found'));
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401,"you can only Update your own listings!"))
    }
    try {
        const updatedListing =  await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
            // new : true,  will give you updated list 
            );
        res.status(200).json(updatedListing);
        
    } catch (error) {
        next(error);
        
    }

    
};

export const getListing = async(req,res,next)=>{
    const listing = await Listing.findById(req.params.id);
    try {
        if(!listing){
            return next(errorHandler(404,'Listing not found!'));
        } 
        res.status(200).json(listing);
        
    } catch (error) {
        next(error);
        
    }

}

// for all 
export const getListings = async(req,res,next)=>{
    try {
        const limit  = parseInt(req.query.limit)||'0';
        const startIndex = parseInt(req.query.startIndex)||0;

        let offer = req.query.offer;
        if(offer === undefined || offer === 'false'){
            offer = {$in : [false,true]};
        }

        let furnished = req.query.furnished;
        if(furnished === undefined || furnished ==='false'){
            furnished = {$in : [false,true]};
        }

        let parking= req.query.parking;
        if(parking === undefined || parking ==='false'){
            parking = {$in: [false,true]};
        }
        let type = req.query.parking;
        if(type === undefined ||type==='all'){
            type = {$in:['sale','rent']};
        }

        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name:{$regex: searchTerm,$options:'i'},
            offer,
            furnished,
            parking,
            type,
        }).sort({[sort]:order}).limit(limit).skip(startIndex)
        // For example, let's say you have a collection of documents with IDs [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]. If you set startIndex to 0 and limit to 5, MongoDB will retrieve documents with IDs 1, 2, 3, 4, and 5. If you set startIndex to 5 and limit to 5, MongoDB will skip the first 5 documents and retrieve documents with IDs 6, 7, 8, 9, and 10.

        return res.status(200).json(listings);
        
    } catch (error) {
        next(error);
        
    }

}