import { model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  _id: string,
  name: string,
  lastname: string,
  email: string;
  username: string,
  password: string;
  comparePassword: (password: string) => Promise<Boolean>
};

const userSchema = new Schema({
  name: {
    type: String,
    unique: false,
    required: true,
    lowercase: true,
    trim: true
  },
  lastname: {
    type: String,
    unique: false,
    required: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    unique: false,
    required: true,
    lowercase: true,
    trim: true
  }
});

userSchema.pre<IUser>("save", async function(next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;

  next();
});

userSchema.methods.comparePassword = async function(
  password: string
): Promise<Boolean> {
  return await bcrypt.compare(password, this.password);
};

export default model<IUser>("User", userSchema);