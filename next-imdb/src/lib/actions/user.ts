import { IUser } from "@/utils/types/User";
import User from "../models/user.model";
import { connect } from "../mongodb/mongoose";

interface EmailAddress {
    email_address: string;
}

export const createOrUpdateUser = async (
    clerkId: string,
    firstName: string,
    lastName: string,
    profilePicture: string,
    email: string
): Promise<IUser> => {
    const user = await User.findOneAndUpdate(
        { clerkId },
        { firstName, lastName, profilePicture, email },
        { new: true, upsert: true }
    );

    if (!user) {
        throw new Error('User not found or could not be created');
    }

    return user;
}

export const deleteUser = async (id: string): Promise<void> => {
    try {
        await connect();
        await User.findOneAndDelete({ clerkId: id });
    } catch (error) {
        console.error("Error: Could not delete user:", error);
    }
};
