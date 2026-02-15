import { useState, useRef } from 'react';
import { uploadImage } from '../lib/api';
import './ImageUpload.css';

export default function ImageUpload({ onUpload, folder = 'products', currentImage }) {
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    function resizeImage(file, maxSize = 1024) {
        return new Promise((resolve) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(url);
                let { width, height } = img;

                if (width <= maxSize && height <= maxSize) {
                    resolve(file);
                    return;
                }

                if (width > height) {
                    height = Math.round((height * maxSize) / width);
                    width = maxSize;
                } else {
                    width = Math.round((width * maxSize) / height);
                    height = maxSize;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        const resizedFile = new File([blob], file.name, {
                            type: file.type || 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(resizedFile);
                    },
                    file.type || 'image/jpeg',
                    0.85
                );
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                resolve(file);
            };
            img.src = url;
        });
    }

    async function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            setError('Wybierz plik graficzny (JPG, PNG, WebP)');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError('Plik jest za duży (max 10 MB)');
            return;
        }

        setError('');
        setPreview(URL.createObjectURL(file));
        setUploading(true);

        try {
            const resizedFile = await resizeImage(file);
            const publicUrl = await uploadImage(resizedFile, folder);
            onUpload(publicUrl);
            setPreview(null);
        } catch (err) {
            setError('Błąd przesyłania: ' + (err.message || 'Spróbuj ponownie'));
        } finally {
            setUploading(false);
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
        setDragging(true);
    }

    function handleDragLeave(e) {
        e.preventDefault();
        setDragging(false);
    }

    function handleDrop(e) {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }

    function handleInputChange(e) {
        const file = e.target.files[0];
        if (file) handleFile(file);
        e.target.value = '';
    }

    return (
        <div className="image-upload-wrapper">
            <div
                className={`image-upload-zone${dragging ? ' dragging' : ''}${uploading ? ' uploading' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
            >
                {uploading ? (
                    <div className="upload-progress">
                        <div className="upload-spinner" />
                        <span>Przesyłanie...</span>
                    </div>
                ) : preview ? (
                    <div className="image-upload-preview">
                        <img src={preview} alt="Podgląd" />
                    </div>
                ) : currentImage ? (
                    <div className="image-upload-preview">
                        <img src={currentImage} alt="Obecne zdjęcie" />
                        <span className="upload-hint">Kliknij lub przeciągnij, aby zmienić</span>
                    </div>
                ) : (
                    <div className="upload-placeholder">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span>Przeciągnij zdjęcie lub kliknij, aby wybrać</span>
                        <small>JPG, PNG, WebP — max 10 MB</small>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    style={{ display: 'none' }}
                />
            </div>

            {error && <div className="image-upload-error">{error}</div>}
        </div>
    );
}
