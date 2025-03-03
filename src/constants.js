const COLLECTION = {
  TASK: "tasks",
  USER: "user",
  ROUTE: "route_priority",
};

const routesToGenerateReqId = {
  sign_up: "/api/v1/auth/signup",
  sign_in: "/api/v1/auth/signin",
};
const mobileValidator = /^[0-9]{10}$/;

const rolePriority = {
  user: 2,
  manager: 1,
  admin: 0,
};

module.exports = {
  COLLECTION,
  mobileValidator,
  routesToGenerateReqId,
  rolePriority,
};
