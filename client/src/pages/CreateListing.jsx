import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react"
import { app } from "../firebase";


export const CreateListing =()=>{
    const [files,setFiles] = useState([]);
    const [formData, setFormData] =  useState({
        imageUrls: [],
    });
    const[imageUploadError, setImageUploadError] = useState(false);
    const [uploading,setUploading] = useState(false);
    // console.log(files);
    console.log(formData);


    const handleImageSubmit = (e)=>{
        
        if(files.length > 0 && files.length + formData.imageUrls.length <7 ){
            const promises = [];
            for(let i=0;i<files.length;i++){
                setUploading(true);
                setImageUploadError(false);
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls)=>{
                setFormData({...formData , imageUrls: formData.imageUrls.concat(urls)});
                // concat method will add new url to privious one (like an array [1stURL,2ndURL,...]) 
                setImageUploadError(false);
                setUploading(false);
                
            }).catch((error)=>{
                
                setImageUploadError('Image upload failed (2 mb max per image)');
                setUploading(false);
            })
            
             
        }else{
            setImageUploadError('You can only upload images at max 6');
            setUploading(false);
        }

    }

    const storeImage = async(file)=>{
        return new Promise((resolve,reject)=>{
            const storage = getStorage(app);
            const fileName = new Date().getTime()+ file.name;
            const storageRef = ref(storage,fileName);
            const uploadTask = uploadBytesResumable(storageRef,file);

            uploadTask.on('state_changed',
            (snapshot)=>{
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
                // console.log(`Upload is ${progress}% done`);
            },
            (error)=>{ reject(error);
            
            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>resolve(downloadURL));
            }
            
            )
        })

    }
    const handleRemoveImage =(index)=>{
        setFormData({...formData, imageUrls: formData.imageUrls.filter((urls,i) => i!==index)})

    }

    return <div className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1> 
        <form className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-4 flex-1">
            <input type="text"  placeholder="Name" id="name" maxLength='62' minLength='10' required className="border p-3 rounded-lg"/>
            <textarea type="text"  placeholder="Desription" id="description" maxLength='62' minLength='10' required className="border rounded-lg p-3"/>
            <input type="text"  placeholder="Address" id="address"  required className="border p-3 rounded-lg"/>
            
            <div className="flex gap-6 flex-wrap my-4"> 
                <div className="flex gap-2 ">
                    <input type="checkbox" id="sale" className="w-5 " />
                    <span>Sell</span>
                </div>
                <div className="flex gap-2 ">
                    <input type="checkbox" id="rent" className="w-5 " />
                    <span>Rent</span>
                </div>
                <div className="flex gap-2 ">
                    <input type="checkbox" id="parking" className="w-5 " />
                    <span>Parking Spot</span>
                </div>
                <div className="flex gap-2 ">
                    <input type="checkbox" id="furnished" className="w-5 " />
                    <span>Furnished</span>
                </div>
                <div className="flex gap-2 ">
                    <input type="checkbox" id="offer" className="w-5 " />
                    <span>Offer</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-6">
                <div className=" flex gap-2 items-center">
                    <input type="number" id = 'bedrooms' min='1' max='10' required className="p-3 rounded-lg  border border-gray-300" />
                    <p>Beds</p>
                </div>
                <div className=" flex gap-2 items-center">
                    <input type="number" id="baths" min='1' max='10' required className="p-3 rounded-lg  border border-gray-300" />
                    <p>Baths</p>
                </div>
                <div className=" flex gap-2 items-center">
                    <input type="number" id="regularPrice" min='1' max='10' required className="p-3 rounded-lg  border border-gray-300" />
                    <div className="flex flex-col items-center">
                    <p>Regular Price</p>
                    <span className="text-xs">($ / month)</span>   
                    </div>
                </div>
                <div className=" flex gap-2 items-center">
                    <input type="number" id="discountPrice" min='1' max='10' required className="p-3 rounded-lg  border border-gray-300" />
                    <div className="flex flex-col items-center">
                    <p>Discounted Price</p>
                    <span className="text-xs">($ / month)</span>   
                    </div>
                </div>
            </div>
            </div>
            <div className="flex flex-col flex-1 gap-4">
                <p className="font-semibold">Images:
                    <span className="font-normal text-gray-600"> The first image will be cover(max 6)</span>
                </p>
                <div className="flex gap-4">
                    <input onChange={(e)=>{setFiles(e.target.files)}} type="file"  id="images" accept="image/*" multiple className="p-3 border border-gray-300 rounded w-full"/>
                    <button type="button" disabled= {uploading} onClick={handleImageSubmit} className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-90">
                        {uploading ? "Uploading..." : "Upload"}
                        </button>
                </div>
                <p className="text-red-700">{imageUploadError && imageUploadError }</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url,index)=>(
                    <div  key={url} className="flex justify-between p-3 border items-center">
                        <img src={url} alt="listing image" className="w-20 h-20 object-cover rounded-lg" />
                        <button  onClick= {()=>handleRemoveImage(index)}type= "button" className="text-red-700 p-3 uppercase hover:opacity-75">Delete</button>
                    </div>
                    ))
                }

            <button className="p-3 bg-slate-700 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80" >Update Listing</button>
            </div>
        </form>
    </div>
}