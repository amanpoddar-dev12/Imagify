// CleanupComponent.jsx
import React, { useRef, useState, useContext } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import SaveImageButton from "../../services/SaveImages";

function CleanupComponent() {
  const { cleanupImage } = useContext(AppContext);
  const canvasRef = useRef(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [drawMode, setDrawMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [cleanedImageUrl, setCleanedImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPEG or PNG images are supported");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setOriginalImage(file);
    setCleanedImageUrl("");

    setTimeout(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = url;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
    }, 100);
  };

  const startDrawing = (e) => {
    if (!drawMode) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "white";
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.beginPath();
    canvas.onmousemove = (ev) => draw(ev, ctx);
  };

  const draw = (e, ctx) => {
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!drawMode) return;
    canvasRef.current.onmousemove = null;
  };

  const handleCleanup = async () => {
    if (!originalImage) {
      toast.error("Upload an image first");
      return;
    }

    setLoading(true);
    try {
      const canvas = canvasRef.current;
      const maskBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });

      const cleaned = await cleanupImage(originalImage, maskBlob, "quality");
      if (cleaned) {
        setCleanedImageUrl(cleaned);
        toast.success("Image cleaned successfully");
      }
    } catch (err) {
      toast.error("Cleanup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Cleanup Tool</h2>
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleImageUpload}
        className="mb-4"
      />

      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          className="border rounded shadow"
        />
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => setDrawMode(!drawMode)}
          className="bg-indigo-500 text-white px-4 py-2 rounded"
        >
          {drawMode ? "Stop Marking" : "Start Marking"}
        </button>
        <button
          onClick={handleCleanup}
          disabled={loading || !originalImage}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Cleaning..." : "Cleanup Image"}
        </button>
      </div>

      {cleanedImageUrl && (
        <div className="flex items-center gap-5  mt-6 text-center">
          <img
            src={cleanedImageUrl}
            alt="Cleaned Result"
            className="max-w-full max-h-[400px] mx-auto"
          />
          <a
            href={cleanedImageUrl}
            download="cleaned-image.png"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download Result
          </a>
          <SaveImageButton imageUrl={cleanedImageUrl} />
        </div>
      )}
    </div>
  );
}

export default CleanupComponent;

// import React, { useRef, useState, useContext } from "react";
// import toast from "react-hot-toast";
// import { AppContext } from "../../context/AppContext";

// function CleanupComponent() {
//   const { cleanupImage } = useContext(AppContext);
//   const canvasRef = useRef(null);
//   const [originalImage, setOriginalImage] = useState(null);
//   const [drawMode, setDrawMode] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [cleanedImageUrl, setCleanedImageUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isDrawing, setIsDrawing] = useState(false);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const validTypes = ["image/jpeg", "image/png"];
//     if (!validTypes.includes(file.type)) {
//       toast.error("Only JPEG or PNG images are supported");
//       return;
//     }

//     const url = URL.createObjectURL(file);
//     setPreviewUrl(url);
//     setOriginalImage(file);
//     setCleanedImageUrl("");

//     setTimeout(() => {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");
//       const img = new Image();
//       img.src = url;
//       img.onload = () => {
//         canvas.width = img.width;
//         canvas.height = img.height;
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         ctx.drawImage(img, 0, 0);
//       };
//     }, 100);
//   };

//   const startDrawing = (e) => {
//     if (!drawMode) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     ctx.strokeStyle = "white";
//     ctx.lineWidth = 20;
//     ctx.lineCap = "round";
//     ctx.beginPath();
//     ctx.moveTo(x, y);

//     setIsDrawing(true);
//   };

//   const draw = (e) => {
//     if (!isDrawing || !drawMode) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     ctx.lineTo(x, y);
//     ctx.stroke();
//   };

//   const stopDrawing = () => {
//     if (!drawMode) return;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     ctx.closePath();
//     setIsDrawing(false);
//   };

//   const handleCleanup = async () => {
//     if (!originalImage) {
//       toast.error("Upload an image first");
//       return;
//     }

//     setLoading(true);
//     try {
//       const canvas = canvasRef.current;
//       const maskBlob = await new Promise((resolve) => {
//         canvas.toBlob(resolve, "image/png");
//       });

//       const cleaned = await cleanupImage(originalImage, maskBlob, "quality");
//       if (cleaned) {
//         setCleanedImageUrl(cleaned);
//         setPreviewUrl(cleaned); // Replace preview image
//         toast.success("Image cleaned successfully");

//         // Load cleaned image back into canvas
//         const img = new Image();
//         img.src = cleaned;
//         img.onload = () => {
//           canvas.width = img.width;
//           canvas.height = img.height;
//           const ctx = canvas.getContext("2d");
//           ctx.clearRect(0, 0, canvas.width, canvas.height);
//           ctx.drawImage(img, 0, 0);
//         };
//       }
//     } catch (err) {
//       toast.error("Cleanup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-semibold mb-4 text-center">Cleanup Tool</h2>

//       <input
//         type="file"
//         accept="image/png, image/jpeg"
//         onChange={handleImageUpload}
//         className="block w-full mb-4 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
//       />

//       {/* Canvas with loader */}
//       {previewUrl && (
//         <div className="relative rounded overflow-hidden border max-h-[400px]">
//           {loading && (
//             <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
//               <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-indigo-600"></div>
//             </div>
//           )}
//           <canvas
//             ref={canvasRef}
//             onMouseDown={startDrawing}
//             onMouseMove={draw}
//             onMouseUp={stopDrawing}
//             onMouseLeave={stopDrawing}
//             className={`w-full object-contain max-h-[400px] transition duration-300 ${
//               loading ? "blur-sm grayscale" : ""
//             }`}
//           />
//         </div>
//       )}

//       {/* Action Buttons */}
//       <div className="flex gap-4 mt-4">
//         <button
//           onClick={() => setDrawMode(!drawMode)}
//           className="bg-indigo-500 text-white px-4 py-2 rounded"
//         >
//           {drawMode ? "Stop Marking" : "Start Marking"}
//         </button>

//         <button
//           onClick={handleCleanup}
//           disabled={loading || !originalImage}
//           className="bg-green-600 text-white px-4 py-2 rounded"
//         >
//           {loading ? "Cleaning..." : "Cleanup Image"}
//         </button>
//       </div>

//       {/* Download Button */}
//       {cleanedImageUrl && (
//         <div className="mt-6 text-center">
//           <a
//             href={cleanedImageUrl}
//             download="cleaned-image.png"
//             className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             Download Result
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CleanupComponent;
