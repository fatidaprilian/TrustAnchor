"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginFormSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(1, "Username is required")
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm(): JSX.Element {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    formState: { errors },
    register,
    handleSubmit
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema)
  });

  async function onSubmit(formValues: LoginFormValues): Promise<void> {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify(formValues),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });

      if (!response.ok) {
        const responseBody = (await response.json()) as {
          error?: {
            message?: string;
          };
        };

        setErrorMessage(responseBody.error?.message ?? "Login failed");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setErrorMessage("The sign-in service is unavailable right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="access-frame frame-panel" onSubmit={handleSubmit(onSubmit)}>
      <div className="section-stack">
        <span className="section-kicker">Credential check</span>
        <h2 className="section-title">Sign in to the issuing desk.</h2>
        <p className="body-copy">
          Use the local bootstrap administrator account to manage templates, issue records, and keep the verification
          chain controlled.
        </p>
      </div>

      <label className="field-block" htmlFor="username">
        <span className="field-label">Username</span>
        <input
          {...register("username")}
          aria-invalid={errors.username ? "true" : "false"}
          autoCapitalize="none"
          autoComplete="username"
          className="field-input"
          id="username"
          placeholder="bootstrap-admin"
          type="text"
        />
        {errors.username ? <span className="field-error">{errors.username.message}</span> : null}
      </label>

      <label className="field-block" htmlFor="password">
        <span className="field-label">Password</span>
        <input
          {...register("password")}
          aria-invalid={errors.password ? "true" : "false"}
          autoComplete="current-password"
          className="field-input"
          id="password"
          placeholder="••••••••"
          type="password"
        />
        {errors.password ? <span className="field-error">{errors.password.message}</span> : null}
      </label>

      <div aria-live="polite" className="status-region">
        {errorMessage ? <div className="status-panel status-panel-danger">{errorMessage}</div> : null}
      </div>

      <button className="button button-primary button-block" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Authorizing access..." : "Authorize issuing desk"}
      </button>
    </form>
  );
}
