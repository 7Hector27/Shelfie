import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

import Alert from "@/components/Alert";
import { apiPost } from "../../lib/api";

import styles from "./SignInContent.module.scss";

const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignInContent = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

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

      await apiPost("/auth/signIn", {
        email: data.email,
        password: data.password,
      });

      // refresh "me" after cookie is set
      await queryClient.invalidateQueries({ queryKey: ["me"] });

      router.push("/"); // or /friends etc
    } catch (err) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Sign in failed");
      }
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
          <label>Email</label>
          <input {...register("email")} placeholder="Email" />
          {errors.email && <p>{errors.email.message}</p>}

          <label>Password</label>
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
          />
          {errors.password && <p>{errors.password.message}</p>}

          <button disabled={isSubmitting} className={styles.submitBtn}>
            {isSubmitting ? "Signing in..." : "Sign In"}
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
