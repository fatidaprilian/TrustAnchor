# Black-Box Test Plan

## Scope
These tests validate TrustAnchor from the outside through browser/API behavior. Testers should not inspect code, private keys, database rows, or internal service functions while executing this plan.

## Test Data
- Platform admin username from `BOOTSTRAP_ADMIN_USERNAME`
- Platform admin password matching `BOOTSTRAP_ADMIN_PASSWORD`
- New institution code: `BBX-{timestamp}`
- New institution operator: `operator-{timestamp}`
- New certificate number: `CERT-BBX-{timestamp}`

## BB-01 Public Homepage
Steps:
1. Open `/`.
2. Confirm the verification lookup is visible.
3. Confirm the internal access panel explains platform admin, institution admin, and public verifier responsibilities.

Expected result:
- Homepage loads without login.
- Public verification remains the primary action.
- Internal access points to the single login page.

## BB-02 Platform Login Redirect
Steps:
1. Open `/login`.
2. Sign in as platform admin.
3. Open `/login` again with the same browser session.

Expected result:
- Login succeeds.
- User is redirected to `/admin/institutions`.
- Reopening `/login` redirects to `/admin/institutions`.

## BB-03 Institution And Operator Management
Steps:
1. As platform admin, open `/admin/institutions`.
2. Create a new institution with an initial operator username and password.
3. Select the institution's operator panel.
4. Add a second operator.
5. Reset the second operator password.

Expected result:
- Institution appears in the institution list.
- Operator list shows the initial operator and the new operator.
- Password reset succeeds without showing password hashes.

## BB-04 Institution Login Redirect
Steps:
1. Sign out.
2. Sign in with the institution operator credentials.
3. Open `/login` again with the same browser session.
4. Open `/admin/institutions`.

Expected result:
- Login succeeds.
- User is redirected to `/admin`.
- Reopening `/login` redirects to `/admin`.
- `/admin/institutions` redirects back to `/admin` or returns forbidden behavior.

## BB-05 Institution Template Creation
Steps:
1. As institution admin, open `/admin/templates/create`.
2. Create an academic certificate template.
3. Open `/admin/templates`.

Expected result:
- Template creation succeeds.
- Template appears only in the institution admin's workspace.
- The form does not require raw JSON.

## BB-06 Certificate Issuance
Steps:
1. Open `/admin/issuances/create`.
2. Select the template.
3. Fill recipient name, recipient identifier, and certificate number.
4. Submit the form.

Expected result:
- Issuance succeeds.
- `Issued At` is not editable in the form.
- Public claims JSON is not required.
- New issuance appears in `/admin/issuances`.

## BB-07 Public Verification
Steps:
1. Copy the verification code from the issuance list.
2. Sign out or use an unauthenticated browser.
3. Open `/verify/{verificationCode}`.

Expected result:
- Verification page is public.
- Certificate status, recipient, institution, certificate number, proof status, and hash are shown.
- Private encrypted payload is not shown.

## BB-08 QR And PDF
Steps:
1. Open `/verify/{verificationCode}`.
2. Download the QR SVG.
3. Open `/verify/{verificationCode}/print`.
4. Download `/api/verifications/{verificationCode}/certificate-pdf`.

Expected result:
- QR renders and points to the verification URL.
- Print view loads.
- PDF returns `application/pdf`.

## BB-09 Revocation
Steps:
1. Sign in as institution admin.
2. Open `/admin/issuances`.
3. Revoke the issued certificate.
4. Open `/verify/{verificationCode}`.

Expected result:
- Revocation succeeds.
- Public verification still verifies proof material.
- Status is `revoked`, not active issued.

## BB-10 Security Boundaries
Steps:
1. As institution admin, try to call `GET /api/admin/institutions`.
2. Submit a mutation without `x-csrf-token`.
3. Repeat login attempts rapidly.

Expected result:
- Platform endpoint is denied for institution admin.
- Missing CSRF token returns `403`.
- Repeated login attempts eventually return rate-limit behavior.

## BB-11 Tamper Evidence Demo
Steps:
1. Run the documented test command in a controlled test environment:

```bash
npm run test -- tests/unit/document-proof.test.ts
```

Expected result:
- Valid proof verifies.
- Tampered hash fails.
- Tampered encrypted payload fails.

## Completion Criteria
- All tests above pass.
- Any failed step has a captured URL, status code, screenshot, and timestamp.
- Production deployment is not accepted until BB-01 through BB-10 pass.
