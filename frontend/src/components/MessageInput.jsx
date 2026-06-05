import React, { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image as ImageIcon, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MAX_DIM = 1024;

const resizeImage = (file, maxDim = MAX_DIM) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = e.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      const resized = await resizeImage(file);
      setImagePreview(resized);
    } catch (err) {
      toast.error("Failed to process image");
      console.error(err);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="bg-base-100 border-t border-base-300 p-2 sm:p-3 md:p-4 w-full flex-shrink-0">
      <div className="max-w-full px-1 sm:px-0">
        {imagePreview && (
          <div className="mb-3 flex items-center gap-2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-base-300 flex items-center justify-center"
                type="button"
                aria-label="Remove attachment"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              className="w-full input input-bordered rounded-lg input-xs sm:input-sm md:input-md"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-label="Message input"
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />

            <button
              type="button"
              className={`btn btn-ghost btn-circle btn-sm ${imagePreview ? "text-emerald-500" : "text-base-content/60"}`}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach image"
            >
              <ImageIcon size={20} />
            </button>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-sm sm:btn-md rounded-full"
            disabled={!text.trim() && !imagePreview}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
export default MessageInput;
