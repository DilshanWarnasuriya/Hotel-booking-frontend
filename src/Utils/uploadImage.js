import axios from "axios";

export default function uploadImage(file) {

    const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;
    const cloud_name = import.meta.env.VITE_CLOUD_NAME;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", upload_preset);
    data.append("cloud_name", cloud_name);
    data.append("folder", "blue villa");

    return axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, data)
}