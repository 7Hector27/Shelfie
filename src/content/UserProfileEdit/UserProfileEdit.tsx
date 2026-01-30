import React, { useRef, useState, useEffect } from "react";
import NextImage from "next/image";
import Cropper, { Area } from "react-easy-crop";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Layout from "@/components/Layout";

import { useAuth } from "../../context/AuthProvider";
import { apiPost } from "@/lib/api";

import styles from "./UserProfileEdit.module.scss";

const editProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  birthdate: z.string().min(1, "Birthdate is required"),
  bio: z.string().max(500),
});

type EditProfileValues = z.infer<typeof editProfileSchema>;

const UserProfileEdit = () => {
  const { user } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthdate: "",
      bio: "",
    },
  });

  /* ---------- image helpers ---------- */

  const onCropComplete = (_: Area | null, croppedPixels: Area | null) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const getCroppedImage = async (src: string, crop: Area) => {
    const image = new window.Image();
    image.src = src;
    await new Promise((res) => (image.onload = res));

    const size = crop.width;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d")!;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(image, crop.x, crop.y, size, size, 0, 0, size, size);

    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), "image/png");
    });
  };

  const handleSaveCrop = async () => {
    if (!preview || !croppedAreaPixels) return;

    setUploading(true);

    try {
      const blob = await getCroppedImage(preview, croppedAreaPixels);
      const formData = new FormData();
      formData.append("image", blob, "profile.jpg");

      await fetch("/user/profile-image", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      setPreview(null); // close cropper
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
  };

  /* ---------- form ---------- */

  const onSubmit = async (data: EditProfileValues) => {
    try {
      await apiPost("/user/profile", {
        first_name: data.firstName,
        last_name: data.lastName,
        birthdate: data.birthdate,
        bio: data.bio,
      });
    } catch (error) {
      alert("Error updating profile. Please try again.");
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreview(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!user) return;

    reset({
      firstName: user.first_name ?? "",
      lastName: user.last_name ?? "",
      birthdate: user.birthdate ? user.birthdate.slice(0, 10) : "",
      bio: user.bio ?? "",
    });
  }, [user, reset]);

  return (
    <Layout>
      <div className={styles.editProfile}>
        <h1 className={styles.title}>Edit Profile</h1>
        <div className={styles.editProfileSection}>
          <div className={styles.avatarSection}>
            <NextImage
              src={user?.profile_image ?? "/images/user_profile.webp"}
              width={80}
              height={80}
              alt="Profile image"
              className={styles.avatar}
            />
            <button type="button" onClick={() => fileInputRef.current?.click()}>
              Change photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </div>
          {preview && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2>Crop profile photo</h2>

                <div className={styles.cropContainer}>
                  <Cropper
                    image={preview}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>

                <div className={styles.controls}>
                  <label>Zoom</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(+e.target.value)}
                  />
                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.cancel}
                    onClick={() => setPreview(null)}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className={styles.save}
                    onClick={handleSaveCrop}
                    disabled={uploading}
                  >
                    {uploading ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* form */}
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.name}>
              <div className={styles.firstName}>
                <label className={styles.label}>First Name</label>
                <input {...register("firstName")} placeholder="First name" />
                {errors.firstName && <p>{errors.firstName.message}</p>}
              </div>
              <div className={styles.lastName}>
                <label className={styles.label}>Last Name</label>
                <input {...register("lastName")} placeholder="Last name" />
                {errors.lastName && <p>{errors.lastName.message}</p>}
              </div>
            </div>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              placeholder="Email"
              value={user?.email ?? ""}
              readOnly
              className={styles.email}
            />

            <label className={styles.label}>Birthdate (MM/DD/YYYY)</label>
            <input type="date" {...register("birthdate")} />
            {errors.birthdate && <p>{errors.birthdate.message}</p>}
            <label className={styles.label}>About Me</label>
            <textarea {...register("bio")} placeholder="Bio" />
            {errors.bio && <p>{errors.bio.message}</p>}
            <button disabled={isSubmitting} className={styles.submitBtn}>
              {isSubmitting ? "Saving..." : "Save profile"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfileEdit;
