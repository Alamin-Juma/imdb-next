import { Document, Model, Schema, model } from 'mongoose';

export interface IFav {
  movieId: string;
  title: string;
  description: string;
  dateReleased: Date;
  rating: number;
  image: string;
}

export interface IUser extends Document {
    _id:string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  favs: IFav[];
}