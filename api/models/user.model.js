import mongoose from 'mongoose';

const userShema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fprofile&psig=AOvVaw1v7vAanvPYDV_16j8tK7jO&ust=1698624610952000&source=images&cd=vfe&ved=0CBIQjRxqFwoTCODMr_v7mYIDFQAAAAAdAAAAABARhttps://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userShema);

export default User;
