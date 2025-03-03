const bcrypt = require("bcrypt");

const { COLLECTION } = require("../constants");
const { ErrorHandler } = require("../middleware/errorHandler");
const { BAD_REQUEST, NOT_FOUND, OK } = require("http-status-codes");
const { db } = require("../config/db");
const { ObjectId } = require("mongodb");

let DB;

const getDb = async () => {
  if (DB) return DB.collection(COLLECTION.USER);

  DB = await db();
  return DB.collection(COLLECTION.USER);
};

async function signUp(data) {
  const db = await getDb();
  const status = await db.insertOne({
    ...data,
    created_at: new Date(),
    updated_at: new Date(),
  });
  if (!status.acknowledged) {
    throw new ErrorHandler(BAD_REQUEST, "DMS-VEO", "uer not created");
  }
  return { status: OK, message: "user ccreated successfully" };
}

async function signIn(username, password) {
  const db = await getDb();
  const User = await db.findOne({ username: username });
  if (!User) throw new ErrorHandler(NOT_FOUND, "DMS-VEO", "user not found");

  const isMatch = await bcrypt.compare(password, User.password);
  if (!isMatch)
    throw new ErrorHandler(BAD_REQUEST, "DMS-VEO", "wrong Credentials");

  return {
    status: OK,
    message: "user login successfully",
    data: { user_id: User._id, role: User.role },
  };
}

async function isUserAlreadyExist(username) {
  const db = await getDb();
  const User = await db.findOne({ username: username });
  if (User)
    throw new ErrorHandler(BAD_REQUEST, "DMS-VEO", "user already exist");

  return { status: OK, message: "user not exist" };
}

async function getUserDetails(user_id) {
  const db = await getDb();
  const User = await db.findOne(
    { _id: ObjectId(user_id) },
    { projection: { password: 0 } }
  );
  if (!User) throw new ErrorHandler(BAD_REQUEST, "DMS-VEO", "user not found");

  return {
    status: OK,
    message: "user details fetched successfully",
    data: User,
  };
}

module.exports = {
  signUp,
  signIn,
  isUserAlreadyExist,
  getUserDetails,
};
