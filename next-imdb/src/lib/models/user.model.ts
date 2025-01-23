import { IFav, IUser } from "@/utils/types/User";
import mongoose, { model, Model, Schema } from "mongoose";

const favSchema = new Schema<IFav>({
  movieId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  dateReleased: { type: Date, required: true },
  rating: { type: Number, required: true },
  image: { type: String, required: true },
});

const userSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePicture: { type: String, required: true },
    favs: { type: [favSchema], default: [] },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || model<IUser>('User', userSchema);
export default User;