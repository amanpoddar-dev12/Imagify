// CleanupComponent.jsx
// import React, { useRef, useState, useContext } from "react";
// import toast from "react-hot-toast";
// import { AppContext } from "../../context/AppContext";
// import SaveImageButton from "../../services/SaveImages";

// function CleanupComponent() {
//   const { cleanupImage } = useContext(AppContext);
//   const canvasRef = useRef(null);
//   const [originalImage, setOriginalImage] = useState(null);
//   const [drawMode, setDrawMode] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [cleanedImageUrl, setCleanedImageUrl] = useState("");
//   const [loading, setLoading] = useState(false);

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
//         ctx.drawImage(img, 0, 0);
//       };
//     }, 100);
//   };

//   const startDrawing = (e) => {
//     if (!drawMode) return;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     ctx.strokeStyle = "white";
//     ctx.lineWidth = 20;
//     ctx.lineCap = "round";
//     ctx.beginPath();
//     canvas.onmousemove = (ev) => draw(ev, ctx);
//   };

//   const draw = (e, ctx) => {
//     const rect = canvasRef.current.getBoundingClientRect();
//     ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
//     ctx.stroke();
//   };

//   const stopDrawing = () => {
//     if (!drawMode) return;
//     canvasRef.current.onmousemove = null;
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
//         toast.success("Image cleaned successfully");
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
//         className="mb-4"
//       />

//       <div className="relative">
//         <canvas
//           ref={canvasRef}
//           onMouseDown={startDrawing}
//           onMouseUp={stopDrawing}
//           className="border rounded shadow"
//         />
//       </div>

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

//       {cleanedImageUrl && (
//         <div className="flex items-center gap-5  mt-6 text-center">
//           <img
//             src={cleanedImageUrl}
//             alt="Cleaned Result"
//             className="max-w-full max-h-[400px] mx-auto"
//           />
//           <a
//             href={cleanedImageUrl}
//             download="cleaned-image.png"
//             className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             Download Result
//           </a>
//           <SaveImageButton imageUrl={cleanedImageUrl} />
//         </div>
//       )}
//     </div>
//   );
// }

// export default CleanupComponent;
