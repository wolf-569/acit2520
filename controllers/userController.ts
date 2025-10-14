import {userModel} from "../models/userModel";

const getUserByEmailIdAndPassword = (email: string, password: string) => {
  let user = userModel.findOne(email);
  if (user) {
    if (isUserValid(user, password)) {
      return user;
    }
  }
  return null;
};
const getUserById = (id:any) => {
  let user = userModel.findById(id);
  if (user) {
    return user;
  }
  return null;
};

const getUserEmail = (email: string) => {
  let user = userModel.findOne(email);
  if (user) {
    return user.email;
  }
  return null;
};

const checkUserPassword = (email: string, password: string) => {
  let user = userModel.findOne(email);
  if (user) {
    return isUserValid(user, password);
  }
  return false;
};

function isUserValid(user: any, password: string) {
  return user.password === password;
}

export {
  getUserByEmailIdAndPassword,
  getUserById,
  getUserEmail,
  checkUserPassword,
};
