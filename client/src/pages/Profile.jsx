import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { signOutUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice";
import { Link } from "react-router-dom";






export const Profile = () => {
    const fileRef = useRef(null);
    const {currentUser,loading,error} = useSelector((state)=>state.user);
    const [file,setFile] = useState(undefined);
    const [filePerc ,setFilePerc] = useState(0); 
    const [fileUploadError,setFileUploadError] = useState(false);
    const [formData,setFormData] = useState({});
    const [updateSuccess,setUpdateSuccess] = useState(false);
    const [showListingError,setShowListingError] = useState(false);
    const [userListings,setUserListings] = useState([]);
    const dispatch = useDispatch();

    console.log(formData);
    


    // console.log(file);
    // console.log(filePerc);
    // console.log(formData);

    useEffect(()=>{
        if(file){
            handleFileUpload(file)
        }

    },[file]);
    const handleFileUpload = (file)=>{
        const storage = getStorage(app);
        // creating a new unique filename using date and time
        const fileName= new Date().getTime()+ file.name;
        const storageRef = ref(storage,fileName);
        // uploadBytesResumable shows the percentage of image
        const uploadTask = uploadBytesResumable(storageRef,file);

        uploadTask.on('state_changed',
        (snapshot)=>{
            // here recoding the progress of upload image "bytesTransferred" tells how much kb passed
            const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
            // console.log('upload is '+progress + '%done');
            setFilePerc(Math.round(progress))
        },
        (error) => {
            setFileUploadError(true);
        },
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>setFormData({...formData,avatar:downloadURL}))
        }
        );



    }
    const handleDeleteUser = async()=>{
        try {
            dispatch(deleteUserStart());
            
            const res = await fetch(`api/user/delete/${currentUser._id}`,{
                method: "DELETE",
            });
            const data  =await res.json();
            if(data.success===false){
                dispatch(deleteUserFailure(data.message))
                return;
            }
            dispatch(deleteUserSuccess(data));
            
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
            
        }
    }

    const handleSignOut=async()=>{
        try {
            dispatch(signOutUserStart());
            const res = await fetch('/api/auth/signout');
            const data = await res.json();
            if(data.success===false){
                dispatch(deleteUserFailure(data.message))
                return;
            }
            dispatch(deleteUserSuccess(data))
            
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
            
        }
    }
    const handleChange = (e)=>{
        setFormData({...formData,[e.target.id]: e.target.value});

    }
    const handleSubmit= async(e)=>{
        e.preventDefault();
        try {
            dispatch(updateUserStart());

            const res = await fetch(`api/user/update/${currentUser._id}`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(formData),

            });
            const data = await res.json();
            if(data.success === false){
                dispatch(updateUserFailure(data.message))
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
            
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    }

    const handleShowListing = async()=>{
        try {
            const res = await fetch(`/api/user/listings/${currentUser._id}`);
            const data = await res.json();
            if(data.success===false){
                setShowListingError(true);
                return;
            }
            setUserListings(data);
            
        } catch (error) {
            setShowListingError(true);
            
        }

    }

    return <div className="p-3 max-w-lg mx-auto"> 
        <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
            <img src={formData.avatar ||currentUser.avatar} alt="profile" onClick={()=>{fileRef.current.click()}} className="rounded-full h-24 w-24 self-center cursor-pointer object-cover" />
            <p className=" text-sm self-center">
            {fileUploadError ? (<span className="text-red-700">Error Image Upload (image must be less than 2 mb)</span>):
            filePerc > 0 && filePerc < 100 ? <span className="text-slate-700">{`Upoading ${filePerc}%`}</span> :
            filePerc==100 ? (<span className="text-green-700">Image Sucessfully uploaded!!</span>) : ""
         }
         </p>
            <input onChange={handleChange} defaultValue={currentUser.username} type="text" id="username" placeholder="username" className="border p-3  rounded-lg"/>
            <input onChange={handleChange} defaultValue={currentUser.email} type="email" id="email" placeholder="email" className="border p-3  rounded-lg"/>
            <input onChange={handleChange} type="password" id="password" placeholder="password" className="border rounded-lg p-3 "/>
            <button disabled = {loading} className="bg-slate-700 p-3 border rounded-lg text-white uppercase hover:opacity-80" > { loading ? 'Loading...':'Update'}</button>
            <Link to={"/create-listing"} className="bg-green-700  p-3 border rounded-lg text-white uppercase hover:opacity-80 text-center">Create Listing</Link>
        </form>
        <div className="flex justify-between mt-5">
            <span onClick={ handleDeleteUser } className="text-red-700 cursor-pointer">Delete account</span>
            <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
        </div>
        <p className="text-red-700 mt-4">{error ? error: ''}</p>
        <p className="text-green-700 mt-4">{updateSuccess ? 'User is updated sucessfully!':''}</p>
        <button onClick={handleShowListing} className="text-green-700 w-full">Show Listing</button>
        <p className="text-red-700 mt-5">{showListingError ? 'Error showing listings' : ""}</p>

        {userListings && userListings.length > 0 && 
        <div className=" flex flex-col gap-4">
            <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings </h1>
        {userListings.map((listing)=>(
        <div className=" border rounded-lg p-3 items-center flex justify-between gap-4" key={listing._id}>
            <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="listing cover" className="h-16 w-16 object-contain" />
            </Link>
            <Link className="text-slate-700 font-semibold flex-1 hover:underline truncate" to={`/listing/${listing._id}`}>
                <p>{listing.name}</p>
            </Link>
            <div className="flex flex-col items-center">
                <button className="text-red-700 uppercase">Delete</button>
                <button className="text-green-700 uppercase">Edit</button>

            </div>
        </div>))}

        </div>}

        </div>
}