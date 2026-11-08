import { z } from "zod";

export const PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Azad Kashmir",
  "Gilgit-Baltistan",
] as const;

/** Removes spaces and dashes. */
function stripPhone(value: string): string {
  return value.replace(/[\s-]/g, "");
}

/** Accepts 03XXXXXXXXX or 923XXXXXXXXX, with an optional leading plus. Network digit is 0 to 4. */
const PK_MOBILE = /^(?:03[0-4]\d{8}|\+?923[0-4]\d{8})$/;

export function isValidPkMobile(value: string): boolean {
  return PK_MOBILE.test(stripPhone(value));
}

/** Converts a valid Pakistan mobile number to the local 03XXXXXXXXX form. Returns the stripped input otherwise. */
export function normalizePhone(value: string): string {
  const stripped = stripPhone(value);
  if (!PK_MOBILE.test(stripped)) return stripped;
  return stripped.startsWith("03") ? stripped : `0${stripped.replace(/^\+?92/, "")}`;
}

const PHONE_MESSAGE = "Enter a valid Pakistan mobile number, for example 0300 1234567";

const requiredPhone = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .refine(isValidPkMobile, PHONE_MESSAGE);

const optionalPhone = z
  .string()
  .trim()
  .refine((v) => v === "" || isValidPkMobile(v), PHONE_MESSAGE);

const optionalEmail = z
  .string()
  .trim()
  .refine((v) => v === "" || z.email().safeParse(v).success, "Enter a valid email address");

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(3, "Please enter your full name"),
  phone: requiredPhone,
  whatsapp: optionalPhone,
  email: optionalEmail,
  province: z.enum(PROVINCES, { error: "Please select your province" }),
  city: z.string().trim().min(2, "Please enter your city"),
  address: z.string().trim().min(10, "Please enter your complete delivery address"),
  notes: z.string().trim().max(300, "Notes can be up to 300 characters"),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
