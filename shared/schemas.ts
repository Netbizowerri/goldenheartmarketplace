import { z } from "zod";

const phonePattern = /^\+?[0-9()\-\s]{10,20}$/;

export const leadSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  businessName: z.string().trim().min(2, "Enter your business name."),
  email: z.email("Enter a valid email address.").transform((value) => value.trim().toLowerCase()),
  phone: z.string().trim().regex(phonePattern, "Enter a valid phone number."),
  businessType: z.string().trim().min(1, "Select a business type."),
  country: z.string().trim().min(2, "Enter your country."),
});

export type LeadInput = z.input<typeof leadSchema>;
export type LeadData = z.output<typeof leadSchema>;
