import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signout,
} from '../redux/user/userSlice';

const Profile = () => {
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleImageUpload(image);
    }
  }, [image]);

  const handleImageUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData((prev) => ({ ...prev, profilePicture: downloadURL }))
        );
      }
    );
  };

  const handleChage = (event) => {
    setFormData((prev) => {
      return {
        ...prev,
        [event.target.id]: event.target.value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignout = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signout());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        />
        <img
          src={
            formData.profilePicture
              ? formData.profilePicture
              : currentUser.profilePicture
          }
          alt={currentUser.username}
          className='h-24 w-24 rounded-full object-cover self-center cursor-pointer mt-2'
          onClick={() => fileRef.current.click()}
        />
        <p className='text-sm self-center'>
          {imageError ? (
            <span className='text-red-700'>
              Error in uploding image (File size most be 2MB or less.)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-slate-700'>
              {`Uploding: ${imagePercent}%..`}
            </span>
          ) : imagePercent === 100 ? (
            <span className='text-green-700'>Image upload successfully</span>
          ) : (
            ''
          )}
        </p>
        <input
          type='text'
          id='username'
          placeholder='Username'
          defaultValue={currentUser.username}
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChage}
        />
        <input
          type='email'
          id='email'
          placeholder='Email'
          defaultValue={currentUser.email}
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChage}
        />
        <input
          type='password'
          id='password'
          placeholder='Password'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChage}
        />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-75'>
          {loading ? 'Loading' : 'Update'}
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span
          onClick={handleDeleteAccount}
          className='text-red-700 cursor-pointer'
        >
          Delete Account
        </span>
        <span onClick={handleSignout} className='text-red-700 cursor-pointer'>
          Sign Out
        </span>
      </div>
      <p className='text-red-700 mt-5'>{error && 'Someting went wrong..'}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess && 'User is updated Successfully'}
      </p>
    </div>
  );
};

export default Profile;
