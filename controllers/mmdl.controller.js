const DownloadIP = require("../models/DownloadIP");
var MobileDetect = require('mobile-detect');

async function checkIpDowloadAndBotCheck(req,res){
        try {
            // bot check

            const {publisher_id} = req.query
            console.log(req.userip, 'user ip')
            const md = new MobileDetect(req.headers['user-agent']);

            if(md.is("bot")){
                return res.status(400).send({
                    error: true,
                    message: "only tuesdays"
                })
            }


            // ip check;
            const ip = await DownloadIP.findOne({ip: req.userip})
            if(ip){
                return res.status(400).send({
                    error: true,
                    message: "Already downloaded"
                })
            }


            const newIPDownload = await new DownloadIP({
                ip: req.userip,
                useragent:req.headers['user-agent'],
            }).save();

            console.log({newIPDownload})


            // do something with publisher id

            res.send({
                message: "done"
            })
        } catch (error) {
            console.log(error);
            return res.status(400).send({
                error: true,
                message: "An Error happened"
            })
        }
}


module.exports = {
    checkIpDowloadAndBotCheck
}