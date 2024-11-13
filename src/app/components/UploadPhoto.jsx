"use client";

import React, { useState, useCallback, useRef } from "react";
import imageCompression from "browser-image-compression";
import { supabase } from "../utils/supabaseClient";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Image from "next/image";
import CameraIcon from "./CameraIcon";
import { motion, AnimatePresence } from "framer-motion";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";

// Configuración de compresión de imagen optimizada para móviles
const compressionOptions = {
  maxSizeMB: 1, // Reducido para móviles
  maxWidthOrHeight: 1080,
  useWebWorker: true,
  initialQuality: 0.8, // Balance entre calidad y tamaño
  alwaysKeepResolution: false
};

const UploadPhoto = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [comment, setComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Refs para mejor manejo de memoria
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);

  // Optimización de la compresión y preview
  const handleFileChange = useCallback(async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile?.type.startsWith("image/")) {
      toast.error("Por favor, selecciona una imagen válida");
      return;
    }

    try {
      // Crear preview inmediato para mejor UX
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      previewUrlRef.current = URL.createObjectURL(selectedFile);
      setPreview(previewUrlRef.current);

      // Comprimir en segundo plano
      const compressedFile = await imageCompression(selectedFile, compressionOptions);
      setFile(compressedFile);
    } catch (error) {
      console.error("Error al procesar la imagen:", error);
      toast.error("Error al procesar la imagen");
      handleRemovePhoto();
    }
  }, []);

  const handleRemovePhoto = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // Optimización de la subida
  const handleUpload = useCallback(async () => {
    if (!file) {
      toast.error("Selecciona una foto antes de compartir");
      return;
    }

    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;

    try {
      // Subida paralela a storage y base de datos
      const [uploadResult, publicUrlResult] = await Promise.all([
        supabase.storage.from("photos").upload(fileName, file),
        supabase.storage.from("photos").getPublicUrl(fileName)
      ]);

      if (uploadResult.error) throw uploadResult.error;

      const imageUrl = publicUrlResult.data.publicUrl;
      const { error: insertError } = await supabase
        .from("uploads")
        .insert([{ image_url: imageUrl, comment }]);

      if (insertError) throw insertError;

      toast.success("¡Foto compartida exitosamente!");
      handleRemovePhoto();
      setComment("");
    } catch (error) {
      console.error("Error en la subida:", error);
      toast.error("Error al compartir la foto");
    } finally {
      setUploading(false);
    }
  }, [file, comment]);

  const onEmojiClick = useCallback((emojiObject) => {
    setComment(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col w-full px-3 sm:px-4 max-w-[500px] mx-auto">
      {/* Header con espaciado reducido */}
      <div className="flex-none flex justify-center h-[60px] mb-1">
        <div className="h-full aspect-square">
          <Image
            src="/images/logo.png"
            width={80}
            height={80}
            alt="Logo"
            className="object-contain w-full h-full"
            priority
          />
        </div>
      </div>
  
      {/* Main Content con espaciado reducido */}
      <div className="flex-1 flex flex-col gap-3 w-full">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
  
        {/* Camera/Preview Container */}
        <div className="relative w-full" style={{ paddingBottom: '133.33%' }}>
          <motion.div 
            className="absolute inset-0 w-full h-full"
            layout
          >
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full bg-purple-800/20 rounded-2xl sm:rounded-3xl backdrop-blur-md border border-white/10 flex flex-col items-center justify-center overflow-hidden transition-all hover:bg-purple-800/30"
              whileTap={{ scale: 0.98 }}
            >
              {preview ? (
                <motion.div 
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={preview}
                    alt="Vista previa"
                    className="object-cover w-full h-full rounded-2xl sm:rounded-3xl"
                  />
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto();
                    }}
                    className="absolute top-3 right-3 w-8 h-8 sm:w-9 sm:h-9 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10"
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </motion.div>
              ) : (
                <div className="text-center p-4 space-y-2">
                  <motion.div 
                    className="inline-block border border-white/20 p-3 sm:p-4 rounded-full bg-purple-800/20"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      delay: 1
                    }}
                  >
                    <CameraIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                  <p className="text-white/90 text-sm sm:text-base font-medium">
                    Toca para tomar una selfie
                  </p>
                </div>
              )}
            </motion.button>
          </motion.div>
        </div>
  
        {/* Comment Section */}
        <div className="flex-none relative w-full">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 180))}
            placeholder="Agrega un comentario..."
            className="w-full p-3 pr-12 bg-purple-800/20 backdrop-blur-md text-white placeholder-white/50 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/25 min-h-[70px] text-sm sm:text-base resize-none"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-3 bottom-3 p-1.5 sm:p-2 text-white/80"
          >
            <BsEmojiSmile className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>
  
        {/* Share Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleUpload}
          disabled={uploading || !file}
          className={`w-full py-4 rounded-xl text-white font-medium shadow-lg border border-white/10 mb-2 text-sm sm:text-base
            ${uploading || !file 
              ? "bg-gray-500/50 cursor-not-allowed" 
              : "bg-pink-600 hover:bg-pink-700 active:bg-pink-700"
            }`}
        >
          {uploading ? "Compartiendo..." : "Compartir selfie"}
        </motion.button>
  
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <>
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-50"
              style={{ maxHeight: '90vh' }}
            >
              <div className="bg-purple-900/95 border-t border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-white/90 text-sm font-medium">Emojis</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEmojiPicker(false)}
                    className="p-1.5 sm:p-2 text-white/80"
                  >
                    <FaTimes className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </motion.button>
                </div>
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  width="100%"
                  height={250}
                  theme="dark"
                  skinTonesDisabled
                  searchDisabled
                  lazyLoadEmojis
                  previewConfig={{ showPreview: false }}
                  categories={['smileys_people', 'animals_nature', 'food_drink', 'symbols']}
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowEmojiPicker(false)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default UploadPhoto;