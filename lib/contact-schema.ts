import { z } from "zod";

/** Loose Pakistan style phone check: digits, spaces, dashes, optional +92 or 0 prefix. */
const phonePattern = /^(?:\+92|0092|92|0)?[\s-]*3\d{2}[\s-]*\d{7}$|^(?:\+92|0092|92|0)[\s-]*\d{2,3}[\s-]*\d{6,8}$/;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .refine((value) => value === "" || phonePattern.test(value), {
      message: "Please enter a valid Pakistan phone number, for example 0300 1234567",
    }),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters")
    .max(1000, "Please keep your message under 1000 characters"),
});

export type ContactValues = z.infer<typeof contactSchema>;
