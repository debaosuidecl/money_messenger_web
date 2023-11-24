
const FcmEngine = require("../classes/fcmEngine.class");

const from = "d7Y3P4-JS_K6NZOom6BjRD:APA91bE-hv-Ky4bQUjN2plt1_-SL0lw-9VzB191ziPjn4-l7jwf4sxYWUveipyQhzsw4_0AMrFMR8uxpnFp_vXrz1537nHNxeLHdEQcI0lNdVea8vEew_FS5dTdF-uS0MiS51S_0tWG0";

(
    async()=>{
        const fcmEngine = new FcmEngine();

        const sent_data = await fcmEngine.send([from], {
            // phone: ,
            title: "Hey Jared it's clem",
            body: "Hi Jared",
            type: "notification",
            request: "url",
            url: "http://moneymessenger.io",
          });

        console.log({sent_data})
    }
)()