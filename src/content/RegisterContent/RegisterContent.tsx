import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Layout from "@/components/Layout";

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
    path: ["confirmPassword"], // show error under confirm field
  });
type RegisterFormValues = z.infer<typeof registerSchema>;
const RegisterContent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    console.log(data);
  };

  return (
    <div className={styles.registerContent}>
      <div className={styles.container}>
        <h1>
          <Image
            src="/images/open_book.webp"
            alt="Shelfie Logo"
            width={36}
            height={28}
          />
          Shelfie
        </h1>
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <label htmlFor="firstName">First Name</label>
          <input {...register("firstName")} placeholder="First name" />
          {errors.firstName && <p>{errors.firstName.message}</p>}
          <label htmlFor="">Last Name</label>
          <input {...register("lastName")} placeholder="Last name" />
          {errors.lastName && <p>{errors.lastName.message}</p>}
          <label htmlFor="">Email</label>
          <input {...register("email")} placeholder="Email" />
          {errors.email && <p>{errors.email.message}</p>}
          <label htmlFor="">Password</label>
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
          />
          {errors.password && <p>{errors.password.message}</p>}
          <label htmlFor="">Confirm Password</label>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirm password"
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
          <button disabled={isSubmitting} className={styles.submitBtn}>
            Create Account
          </button>
        </form>
        <div className={styles.tos}>
          By creating an account, you agree to Shelfie&apos;s{" "}
          <Link href="/terms">Terms of Service </Link>
          and <Link href="/privacy">Privacy Policy</Link>.
        </div>
        <Image
          src="/images/books.webp"
          alt="Register Illustration"
          width={150}
          height={150}
          className={styles.booksImg}
        />
        <div className={styles.loginLink}>
          <span>
            Already have an account? <Link href="/login"> Sign in</Link>
          </span>
        </div>
      </div>
    </div>
  );
};
export default RegisterContent;
