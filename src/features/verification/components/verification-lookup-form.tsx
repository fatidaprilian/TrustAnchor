"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const verificationLookupSchema = z.object({
  verificationCode: z.string().min(4, "Verification code is required")
});

type VerificationLookupValues = z.infer<typeof verificationLookupSchema>;

export function VerificationLookupForm(): JSX.Element {
  const router = useRouter();
  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<VerificationLookupValues>({
    resolver: zodResolver(verificationLookupSchema)
  });

  function onSubmit(formValues: VerificationLookupValues): void {
    router.push(`/verify/${encodeURIComponent(formValues.verificationCode)}`);
  }

  return (
    <form className="lookup-form" onSubmit={handleSubmit(onSubmit)}>
      <label className="field-block" htmlFor="verificationCode">
        <span className="field-label">Verification code</span>
        <input
          {...register("verificationCode")}
          aria-invalid={errors.verificationCode ? "true" : "false"}
          autoCapitalize="characters"
          autoComplete="off"
          className="field-input"
          id="verificationCode"
          inputMode="text"
          placeholder="TA-0F5N9A7K2Q"
          spellCheck={false}
          type="text"
        />
        {errors.verificationCode ? <span className="field-error">{errors.verificationCode.message}</span> : null}
      </label>

      <p className="helper-copy">
        Use the public record code printed on the certificate or shared by the issuing institution.
      </p>

      <button className="button button-primary button-block" type="submit">
        Verify record
      </button>
    </form>
  );
}
