// require 3 things- model,statuscodes and request
const Job=require('../models/Job')
const {StatusCodes}=require('http-status-codes')
const {BadRequestError, NotFoundError}=require('../errors')

const getAllJobs =async (req,res)=> {
    //find all jobs of the user
    const jobs=await Job.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs,count:jobs.length})
}

const getJob =async (req,res)=> {
    const {
        user:{userId},
        params:{id:jobId},
     }=req

    // find a particular job having jobid of the user having userid
    const job=await Job.findOne({_id:jobId,createdBy:userId})
    if(!job){
        throw new NotFoundError(`No job with ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}

const createJob =async (req,res)=> {
    req.body.createdBy=req.user.userId //create a new property 'createdBy' in req.body and add the userId to it present in req.user from auth middleware
    const job=await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob =async (req,res)=> {
    const {
        body:{company,position},
        user:{userId},
        params:{id:jobId},
     }=req

    if(company=='' || position==''){
        throw new BadRequestError('Company or Position fields cannot be empty')
    }
    const job=await Job.findByIdAndUpdate({_id:jobId,createdBy:userId},req.body,{new:true,runValidators:true})

    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}

const deleteJob =async (req,res)=> {
    // one coming from auth middleware and other from params
    const {
        user:{userId},
        params:{id:jobId},
     }=req

    const job=await Job.findOneAndRemove({
        _id:jobId,
        createdBy:userId
    })
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).send()
}

module.exports={getAllJobs,getJob,createJob,updateJob,deleteJob}
