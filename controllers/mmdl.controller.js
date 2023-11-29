const DownloadIP = require("../models/DownloadIP");
const MobileDetect = require('mobile-detect');
const axios = require("axios");
const path = require("path");
async function checkIpDowloadAndBotCheck(req,res){
        try {
            // bot check

            const {aid, clickid,} = req.query
            console.log(req.userip, 'user ip')
            const md = new MobileDetect(req.headers['user-agent']);

            if(md.is("bot") || md.is("iPhone")){
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
                aid: aid,
                clickid: clickid
            }).save();

            console.log({newIPDownload})




            // do something with publisher id

            res.send({
                message: "done"
            })

            try {
                await axios.get(`https://postback.hastraffic.com/?clickid=&${click_id}revenue=0.5&aid=${aid}`)
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
            return res.status(400).send({
                error: true,
                message: "An Error happened"
            })
        }
}


async function downloadfile(req,res){
        const file = require("fs").createReadStream(path.resolve(__dirname, "..","install", "money-messenger.apk"));
        res.setHeader("Content-Type", "application/vnd.android.package-archive");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=moneymessenger.apk`
        );
        file.pipe(res);

}

module.exports = {
    checkIpDowloadAndBotCheck,
    downloadfile
}