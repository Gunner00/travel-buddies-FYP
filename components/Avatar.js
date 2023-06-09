import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Image } from "next/image";

export default function Avatar({ url, size, onUpload, showUpload = true, className="w-48 h-48 lg:w-60 lg:h-60 rounded-md" }) {
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (url) downloadImage(url);
    }, [url]);

    async function downloadImage(path) {
        try {
            const { data, error } = await supabase.storage
                .from("avatars")
                .download(path);
            if (error) {
                throw error;
            }
            const url = URL.createObjectURL(data);
            setAvatarUrl(url);
        } catch (error) {
            console.log("Error downloading image: ", error.message);
        }
    }

    async function uploadAvatar(event) {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            onUpload(filePath);
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    }

    return (
        <div>
            {avatarUrl ? (
                <Image
                    src={avatarUrl}
                    alt="Avatar"
                    className={className}
                />
            ) : (
                <div className="" />
            )}
            {showUpload && (
                <div className="mt-2">
                    <label className="interBody" htmlFor="single">
                        {uploading ? "Uploading ..." : "Upload a file"}
                    </label>
                    <input
                        className="hidden absolute"
                        type="file"
                        id="single"
                        accept="image/*"
                        onChange={uploadAvatar}
                        disabled={uploading}
                    />
                </div>
            )}
        </div>
    );
}
