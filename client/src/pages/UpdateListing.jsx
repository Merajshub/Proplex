import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react"
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate,useParams } from "react-router-dom";




export const UpdateListing =()=>{
    const navigate = useNavigate();
    const [files,setFiles] = useState([]);
    const{currentUser} = useSelector(state=>state.user);
    const [formData, setFormData] =  useState({
        imageUrls: [],
        name:'',
        description:'',
        address: '',
        type: 'rent',
        bedrooms:1,
        bathrooms:1,
        regularPrice:50,
        discountPrice: 0,
        parking:false,
        furnished :false,
        offer: false,
        sale: false,
       });
       const[error,setError] = useState(false);
       const[loading,setLoading] = useState(false);

    const[imageUploadError, setImageUploadError] = useState(false);
    const [uploading,setUploading] = useState(false);
    const params = useParams();
    // console.log(files);
    useEffect(()=>{
        const fetchListing =async()=>{
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data  = await res.json();
            if(data.message==false){
                console.log(data.message);
                return;
            }
            setFormData(data);
            
            // console.log(listingId); 
        }

        fetchListing();



    },[]);
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
                // concate method will add new url to privious one (like an array [1stURL,2ndURL,...]) 
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
        //this code filters out an element from the array based on its index. It keeps all elements except the one at the index specified by the 'index' variable.

    }
    const handleChange = (e)=>{
        if(e.target.id ==='sale'|| e.target.id === 'rent'){
            setFormData({...formData, type: e.target.id})
            
        }
        if(e.target.id ==='parking' || e.target.id ==='furnished' || e.target.id ==='offer' ){
            setFormData({...formData,[e.target.id]:e.target.checked})
        }

        if(e.target.type === 'number'|| e.target.type === 'text' || e.target.type === 'textarea' ){
            setFormData({...formData,[e.target.id]: e.target.value});
        }
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try { 
            if(formData.imageUrls.length<1) return setError('You must upload atleast 1 image');
            if(formData.regularPrice<formData.discountPrice) return setError('Discount Price must be greater than Regular Price');
            setLoading(true);
            setError(false);
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({...formData, userRef:currentUser._id,}),
            });
            const data = await res.json();
            setLoading(false);
            if(data.success === false){
                setError(data.message);
            }
            navigate(`/listing/${data._id}`);
            
        } catch (error) {
            setError(error.message);
            setLoading(false);
            
        }

    
    }

    return <div className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7"> Update a Listing</h1> 
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-4 flex-1">

            <input onChange={handleChange} value={formData.name} type="text"  placeholder="Name" id="name" maxLength='62' minLength='10' required className="border p-3 rounded-lg"/>

            <textarea onChange={handleChange} value={formData.description} type="text"  placeholder="Desription" id="description" maxLength='620' minLength='10' required className="border rounded-lg p-3"/>

            <input onChange={handleChange} value ={formData.address} type="text"  placeholder="Address" id="address"  required className="border p-3 rounded-lg"/>
            
            <div className="flex gap-6 flex-wrap my-4"> 
                <div className="flex gap-2 ">
                    <input type="checkbox" id="sale" className="w-5 " onChange={handleChange}
                    checked = {formData.type === 'sale'} />
                    <span>Sell</span>
                </div>
                <div className="flex gap-2 ">
                    <input type="checkbox" id="rent" className="w-5 " onChange={handleChange}
                    checked={formData.type=== 'rent'} />
                    <span>Rent</span>
                </div>
                <div className="flex gap-2 ">
                    <input type="checkbox" id="parking" className="w-5 " onChange={handleChange}
                    checked= {formData.parking} />
                    <span>Parking Spot</span>
                </div>
                <div className="flex gap-2 ">
                    <input type="checkbox" id="furnished" className="w-5 " onChange={handleChange} checked={formData.furnished} />
                    <span>Furnished</span>
                </div>
                <div className="flex gap-2 ">
                    <input type="checkbox" id="offer" className="w-5 " onChange={handleChange} checked=  {formData.offer} />
                    <span>Offer</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-6">
                <div className=" flex gap-2 items-center">
                    <input type="number" id = 'bedrooms' min='1' max='10' required className="p-3 rounded-lg  border border-gray-300" 
                    onChange={handleChange} value={formData.bedrooms} />
                    <p>Beds</p>
                </div>
                <div className=" flex gap-2 items-center">
                    <input type="number" id="bathrooms" min='1' max='10' required className="p-3 rounded-lg  border border-gray-300"
                    onChange={handleChange}  value={formData.bathrooms}/>
                    <p>Baths</p>
                </div>
                
                <div className=" flex gap-2 items-center">
                    <input type="number" id="regularPrice" min='50' max='1000000' required className="p-3 rounded-lg  border border-gray-300"
                    onChange={handleChange}  value={formData.regularPrice}/>
                    <div className="flex flex-col items-center">
                    <p>Regular Price</p>
                    <span className="text-xs">($ / month)</span>   
                    </div>
                </div>
                {formData.offer &&(
                // if offer is true then show me the discount section
                <div className=" flex gap-2 items-center">
                    <input type="number" id="discountPrice" min='0' max='1000' required className="p-3 rounded-lg  border border-gray-300"
                    onChange={handleChange}  value={formData.discountPrice}/>
                    <div className="flex flex-col items-center">
                    <p>Discounted Price</p>
                    <span className="text-xs">($ / month)</span>   
                    </div>
                </div>                     
                )}
                
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

            <button disabled = {loading || uploading} className="p-3 bg-slate-700 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80" >
                {loading?'Updating...': 'Update Listing' }
            </button>
            {error && <p className="text-red-700 text-sm">{error}</p>}
            </div>
        </form>
    </div>
}