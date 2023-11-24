const cron = require("node-cron");
const tasks = [];
let stop = false;
const task = cron.schedule("*/1 * * * * *", function () {
  console.log("running every second");
  console.log(stop);
  stop = true;
});

const interval = setInterval(() => {
  if (stop) {
    console.log(stop, "stopping");
    task.stop();
    clearInterval(interval);
  }
}, 10000);
