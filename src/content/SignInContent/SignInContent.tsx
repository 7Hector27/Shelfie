import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Alert from "@/components/Alert";

import { apiPost } from "../../lib/api";
import { useAuth } from "../../context/AuthProvider";

import styles from "./SignInContent.module.scss";

const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;
const SignInContent = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      setServerError(null);

      const payload = {
        email: data.email,
        password: data.password,
      };
      const res = await apiPost<{ id: string; email: string }>(
        "/auth/signIn",
        payload,
      );
      // TODO: redirect to dashboard / home page after sign in, Add came_from param support

      setUser(res);
    } catch (err) {
      setServerError(`${err}` || "An unexpected error occurred");
    }
  };

  return (
    <div className={styles.signInContent}>
      {serverError && (
        <Alert
          message={serverError || ""}
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
          />
          Shelfie
        </h1>
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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

          <button disabled={isSubmitting} className={styles.submitBtn}>
            Sign In
          </button>
        </form>
        <div className={styles.tos}>
          By signing in, you agree to the{" "}
          <Link href="/terms">Terms of Service</Link> and{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </div>

        <div className={styles.registerLink}>
          <div className={styles.newTo}>
            <div className={styles.halfDiv} />
            <span>New to Shelfie?</span>
            <div className={styles.halfDiv} />
          </div>
          <Link href="/register">Create Account</Link>
        </div>
      </div>
    </div>
  );
};
export default SignInContent;
