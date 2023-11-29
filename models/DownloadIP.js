const mongoose = require("mongoose");

const DownloadIp = new mongoose.Schema(
  {
    ip: {
        type: String,
        required: true,
    },
    useragent: {
      type: String,
    },
    aid: {
      type: String,
    },
    clickid: {
      type: String,
    }

  },
  {
    timestamps: true,
  }
);

// DownloadIp.index({ user_id: 1, createdAt: 1 });
DownloadIp.index({ ip: 1 });
// DownloadIp.index({ pending: 1 });
// export model user with DownloadIp
module.exports = mongoose.model("DownloadIp", DownloadIp);

// myModule.DownloadIpSchema = DownloadIp;
