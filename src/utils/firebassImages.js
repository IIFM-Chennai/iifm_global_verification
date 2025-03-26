import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import Compressor from "compressorjs";
import { toast } from "react-toastify";
import { storage } from "../config/firebaseConfig";


export const uploadImageToFirebase = async (file, type, registerNo, setUploadProgress) => {
    if (!file) {
        toast.error(`Please upload a valid ${type} file.`);
        return null;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB limit before compression
    const allowedFormats = ["image/jpeg", "image/png"];

    if (!allowedFormats.includes(file.type)) {
        toast.error(`Invalid ${type} format. Only JPG and PNG are allowed.`);
        return null;
    }

    return new Promise((resolve, reject) => {
        new Compressor(file, {
            quality: 0.6, // Adjust quality for compression
            success: async (compressedFile) => {
                if (compressedFile.size > maxSize) {
                    toast.error(`${type} size exceeds 5MB even after compression.`);
                    return resolve(null);
                }

                const currentDate = new Date().toISOString().split("T")[0];
                const fileName = `${registerNo}-${currentDate}-${type}.jpg`;

                const storageRef = ref(storage, `candidate_uploads/${fileName}`);
                const uploadTask = uploadBytesResumable(storageRef, compressedFile);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadProgress((prev) => ({ ...prev, [type]: progress })); // Update progress
                    },
                    (error) => {
                        toast.error(`Failed to upload ${type}. Try again.`);
                        reject(null);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        setUploadProgress((prev) => ({ ...prev, [type]: 100 })); // Mark complete
                        resolve(downloadURL);
                    }
                );
            },
            error: (err) => {
                toast.error(`Compression failed for ${type}.`);
                reject(null);
            }
        });
    });
};


// Function to delete an image from Firebase Storage
export const deleteImageFromStorage = async (url) => {
    if (url) {
        const imageRef = ref(storage, url);
        try {
            await deleteObject(imageRef);
            // console.log(`Deleted from storage: ${url}`);
        } catch (error) {
            // console.error(`Error deleting file: ${url}`, error);
            console.error(`Error deleting file: `, error);
        }
    }
};

