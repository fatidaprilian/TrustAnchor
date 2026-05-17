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

interface LoginResponseBody {
  user?: {
    role?: string;
  };
}

function getDefaultRedirectPath(role?: string): string {
  return role === "platform_admin" ? "/admin/institutions" : "/admin";
}

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

      const responseBody = (await response.json()) as LoginResponseBody;
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get("redirect") ?? getDefaultRedirectPath(responseBody.user?.role);
      window.location.href = redirectPath;
    } catch {
      setErrorMessage("The sign-in service is unavailable right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="access-frame register-surface reveal-surface" onSubmit={handleSubmit(onSubmit)}>
      <span className="register-tab">Credential register</span>
      <div className="section-stack">
        <span className="section-kicker">Operator check</span>
        <h2 className="section-title">Unlock the issuing register.</h2>
        <p className="body-copy">
          Use the local bootstrap administrator account before templates and issuance records enter the public
          verification flow.
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
          placeholder="testadmin"
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
        {isSubmitting ? "Checking access..." : "Open issuing register"}
      </button>
    </form>
  );
}
