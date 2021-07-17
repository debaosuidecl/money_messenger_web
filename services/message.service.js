const MessageSchema = require("../models/MessageSchema");
const PipeRandomSchemaSave = require("../models/PipeRandomSchemaSave");

async function findmessageschemas(query, limit, page = 0) {
  try {
    const messageschemas = await MessageSchema.find(query)
      .sort("-date")
      .limit(limit)
      .skip(parseInt(limit) * page)
      .lean();

    return messageschemas;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function createpipelineschema(details) {
  try {
    const pipeline = new PipeRandomSchemaSave(details);

    const result = await pipeline.save();

    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function findpipelines(query, limit, page) {
  try {
    const messageschemas = await PipeRandomSchemaSave.find(query)
      .sort("-date")
      .limit(limit)
      .skip(parseInt(limit) * page)
      .lean();

    return messageschemas;
  } catch (error) {
    console.error(error);
    return false;
  }
}
async function createmessageschema(details) {
  try {
    const messageschema = new MessageSchema(details);

    const result = await messageschema.save();

    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function findAndUpdatemessageschema(query, update, type) {
  try {
    const result = await MessageSchema.findOneAndUpdate(
      query,
      {
        [`$${type}`]: update,
      },
      {
        new: true,
      }
    );

    return result;
  } catch (error) {
    console.error(error);

    return false;
  }
}
async function updatepipeline(query, update, type) {
  try {
    const result = await PipeRandomSchemaSave.findOneAndUpdate(
      query,
      {
        [`$${type}`]: update,
      },
      {
        new: true,
      }
    );
    console.log(result, 89);

    return result;
  } catch (error) {
    console.error(error);

    return false;
  }
}
async function deletemessageschema(query) {
  try {
    const result = await MessageSchema.findOneAndDelete(query);

    return result;
  } catch (error) {
    console.error(error);

    return false;
  }
}
async function deletepipeline(query) {
  try {
    const result = await PipeRandomSchemaSave.findOneAndDelete(query);

    return result;
  } catch (error) {
    console.error(error);

    return false;
  }
}

async function findOnemessageschema(query) {
  try {
    const messageschema = await MessageSchema.findOne(query).lean();

    if (!messageschema) {
      return false;
    }
    return messageschema;
  } catch (error) {
    console.log(error);
    return false;
  }
}
async function findonepipeline(query) {
  try {
    const pipeline = await PipeRandomSchemaSave.findOne(query).lean();

    if (!pipeline) {
      return false;
    }
    return pipeline;
  } catch (error) {
    console.log(error);
    return false;
  }
}
module.exports = {
  findmessageschemas,
  createmessageschema,
  deletemessageschema,
  findOnemessageschema,
  createpipelineschema,
  findAndUpdatemessageschema,
  findpipelines,
  updatepipeline,
  deletepipeline,
  findonepipeline,
};
