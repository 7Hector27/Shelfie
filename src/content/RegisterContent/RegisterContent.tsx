import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

import Alert from "@/components/Alert";
import { apiPost } from "../../lib/api";

import { redirectTo } from "@/util/clientUtils";

import styles from "./RegisterContent.module.scss";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterContent = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    setServerSuccess(null);

    try {
      await apiPost("/auth/register", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      // refresh authenticated user
      await queryClient.invalidateQueries({ queryKey: ["me"] });

      // Show success message
      setServerSuccess("Account created successfully");
      setTimeout(() => {
        redirectTo("/"); // or /friends etc
      }, 2500);
    } catch (err) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Something went wrong");
      }
    }
  };

  return (
    <div className={styles.registerContent}>
      {serverError && (
        <Alert
          message={serverError}
          duration={3500}
          onClose={() => setServerError(null)}
        />
      )}

      <div className={styles.container}>
        <h1>
          <Image
            src="/images/open_book.webp"
            alt="Shelfie Logo"
            width={36}
            height={28}
            className={styles.openBook}
          />
          Shelfie
        </h1>

        <h2>Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <label>First Name</label>
          <input {...register("firstName")} />
          {errors.firstName && <p>{errors.firstName.message}</p>}

          <label>Last Name</label>
          <input {...register("lastName")} />
          {errors.lastName && <p>{errors.lastName.message}</p>}

          <label>Email</label>
          <input {...register("email")} type="email" />
          {errors.email && <p>{errors.email.message}</p>}

          <label>Password</label>
          <input {...register("password")} type="password" />
          {errors.password && <p>{errors.password.message}</p>}

          <label>Confirm Password</label>
          <input {...register("confirmPassword")} type="password" />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

          <button disabled={isSubmitting} className={styles.submitBtn}>
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>

          {serverSuccess && (
            <p className={styles.serverSuccess}>{serverSuccess}</p>
          )}
        </form>

        <div className={styles.tos}>
          By creating an account, you agree to Shelfie&apos;s{" "}
          <Link href="/terms">Terms of Service</Link> and{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </div>

        <div className={styles.loginLink}>
          Already have an account? <Link href="/signin">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterContent;
