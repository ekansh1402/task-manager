const { BAD_REQUEST, NOT_FOUND, OK } = require("http-status-codes");
const { COLLECTION } = require("../constants");
const { ErrorHandler } = require("../middleware/errorHandler");
const { ObjectId } = require("mongodb");
const { db } = require("../config/db");
const { getUserDetails } = require("./user");

let DB;
const getDb = async () => {
  if (DB) return DB.collection(COLLECTION.TASK);
  DB = await db();
  return DB.collection(COLLECTION.TASK);
};

async function addTask(data, user_id) {
  const db = await getDb();

  const Status = await db.insertOne({
    ...data,
    assigned_date: new Date(),
    updated_at: new Date(),
    user_id,
  });

  if (Status.acknowledged) {
    return { status: OK, message: "task created!!" };
  }
  throw new ErrorHandler(BAD_REQUEST, "DMS-VEO", "task not created");
}

async function getTask(filter, paging) {
  const db = await getDb();
  const entries = await db
    .find({
      status: { $ne: "deleted" },
      ...filter,
    })
    .skip((paging.page_no - 1) * paging.page_size)
    .limit(paging.page_size);

  const user_details = await getUserDetails(filter.user_id);

  if (entries) {
    const tasks = await entries.toArray();
    return {
      status: OK,
      data: { user_data: user_details.data, entries: tasks },
      message: "task fetched successfully",
    };
  }

  throw new ErrorHandler(NOT_FOUND, "DMS_VEO", "tasks not found");
}

async function deleteTask(data) {
  const { task_id } = data;
  const db = await getDb();

  const entry = await db.findOneAndUpdate(
    {
      _id: ObjectId(task_id),
      status: { $ne: "deleted" },
    },
    { $set: { status: "deleted", updated_at: new Date() } },
    { returnDocument: "after" }
  );

  if (!entry.value)
    throw new ErrorHandler(NOT_FOUND, "DMS-VEO", "task not found");

  return { status: OK, message: "task deleted" };
}

async function updateTask(data) {
  const db = await getDb();

  const entry = await db.updateOne(
    { _id: ObjectId(data.task_id) },
    {
      $set: {
        status: data.status,
        dedline: data.deadline,
        updated_at: new Date(),
      },
    }
  );
  if (entry.matchedCount === 0) {
    throw new ErrorHandler(NOT_FOUND, "DMS-VEO", "task not found");
  } else if (entry.modifiedCount == 0)
    throw new ErrorHandler(BAD_REQUEST, "DMS-VEO", "task already up-to-date");
  return { status: OK, message: "task updated" };
}

async function getAllTask(filter, paging) {
  if (filter.user && filter.user.fullname) {
    filter.user.$or = [
      {
        fullname: { $regex: filter.user.fullname, $options: "i" },
      },
      {
        fullname: {
          $regex: `^${filter.user.fullname}`,
          $options: "i",
        },
      },
    ];
    delete filter.user.fullname;
  }

  const db = await getDb();
  const entries = await db
    .aggregate([
      {
        $lookup: {
          from: COLLECTION.USER,
          let: { user_id: "$user_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$user_id" }],
                },
                ...filter.user,
              },
            },
            {
              $project: {
                password: 0,
                _id: 0,
              },
            },
          ],
          as: "userInfo",
        },
      },
      {
        $match: {
          userInfo: { $ne: [] },
          ...filter.task,
          status: { $ne: "deleted" },
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          _id: 0,
        },
      },
    ])
    .skip((paging.page_no - 1) * paging.page_size)
    .limit(paging.page_size);
  console.log(entries);

  if (entries) {
    const tasks = await entries.toArray();
    return {
      status: OK,
      data: { entries: tasks },
      message: "task fetched successfully",
    };
  }

  throw new ErrorHandler(NOT_FOUND, "DMS_VEO", "tasks not found");
}

module.exports = { addTask, getTask, updateTask, deleteTask, getAllTask };
