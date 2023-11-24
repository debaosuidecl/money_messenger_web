const {
    findoneuser,
    createonetimelink,
    sendonetimelinktoemail,
  } = require("../services/user.service");

  const ApiKeyModel = require("../models/Apikey.model")
  // const { check } = require("express-validator");
  let uuidv4 = require("uuid");
  let bitcore = require("bitcore-lib");
  const paypal = require("paypal-rest-sdk");
  
  const jwt = require("jsonwebtoken");
  const DIR = "adminlogo/";
  
  const dotenv = require("dotenv");
  const User = require("../models/User");

  const randomString = require("randomstring");
  
  dotenv.config();
  
  async function createAPIKey(req,res){
    try {

        const newkey = randomString.generate(40)
        const newApiKey = await new ApiKeyModel({
            user: req.user.id,
            apiKey: newkey,
            

        }).save();


        res.status(201).send({
            message: "success",
            data: newApiKey
        })

    } catch (error) {
        res.status(500).send({
            message:"error occured in server",
            error: true,
        })
    }

  }
  async function fetchApiKey(req,res){
    try {

        // const newkey = randomString.generate(40)
        let newApiKey = await  ApiKeyModel.findOne({
            user: req.user.id,            
        }).sort("-createdAt")
        // let apikey = "";

        if(!newApiKey){

            const newkey = randomString.generate(40)
             newApiKey = await new ApiKeyModel({
                user: req.user.id,
                apiKey: newkey,
                
    
            }).save();
        }

        res.status(201).send({
            message: "success",
            data: newApiKey
        })

    } catch (error) {
        res.status(500).send({
            message:"error occured in server",
            error: true,
        })
    }

  }
  
  
  module.exports = {
    createAPIKey,
    fetchApiKey,
  };
  