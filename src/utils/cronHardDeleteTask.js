const cron = require("node-cron");
const fs = require("fs");
const { db } = require("../config/db");
const { COLLECTION } = require("../constants");
const { ErrorHandler } = require("../middleware/errorHandler");
const { BAD_REQUEST, OK } = require("http-status-codes");
const axios = require("axios");
const response = require("./response");

let DB;
const getDb = async () => {
  if (DB) return DB.collection(COLLECTION.TASK);
  DB = await db();
  return DB.collection(COLLECTION.TASK);
};

function logDeletedTasksToFile(tasks) {
  const logData = {};

  tasks.map((task, index) => {
    logData[`Task${index}`] = ` ${JSON.stringify(task)}, Soft Deleted At: ${
      task.updated_at
    }, Hard Deleted At: ${new Date()}`;
  });

  const logString = JSON.stringify(logData, null, 2);
  fs.appendFileSync("deletedTask/deleted.json", logString + "\n", "utf8");
}
async function cronHardDeleteTask() {
  try {
    const db = await getDb();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const tasksToDelete = await db
      .find({ status: "deleted", updated_at: { $lte: twoDaysAgo } })
      .toArray();
    const batchSize = 5;
    let allDeletedTaskIds = [];

    for (let i = 0; i < tasksToDelete.length; i += batchSize) {
      const batch = tasksToDelete.slice(i, i + batchSize);
      logDeletedTasksToFile(batch);
      const taskIds = batch.map((task) => task._id);
      allDeletedTaskIds.push(...taskIds);
      await db.deleteMany({ _id: { $in: taskIds } });
      if (i + batchSize < tasksToDelete.length) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
    }

    if (allDeletedTaskIds.length > 0)
      sendToGoogleChat(allDeletedTaskIds.length, allDeletedTaskIds);
    return response(OK, "hard tasks deleted", { allDeletedTaskIds });
  } catch (error) {
    throw new ErrorHandler(BAD_REQUEST, "DMS-VEO", error);
  }
}

async function sendToGoogleChat(deleteCount, deleteIds) {
  const deleteIdsString = JSON.stringify(deleteIds);

  const message = {
    text: `{
        "deleteCount": ${deleteCount},
        "deleteId": ${deleteIdsString},
        "intern_name": "ekansh"
      }`,
  };

  try {
    const webhookUrl =
      "https://chat.googleapis.com/v1/spaces/AAAAKceR3IQ/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=iZ8dIK-MIqkFPOO6omMwGVjqZvnk6TQzj-ARLvxINP0";
    await axios.post(webhookUrl, message, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Message sent to Google Chat successfully.");
  } catch (error) {
    console.error("Error sending message to Google Chat:", error);
  }
}

cron.schedule("1 0 * * *", async () => {
  await cronHardDeleteTask();
});

module.exports = { cronHardDeleteTask };
