import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "L'email è obbligatoria" })
    .email({ message: "Inserisci un'email valida" }),
  password: z.string().min(1, { message: "La password è obbligatoria" }),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Il nome è obbligatorio" })
    .min(2, { message: "Il nome deve essere di almeno 2 caratteri" }),
  email: z
    .string()
    .min(1, { message: "L'email è obbligatoria" })
    .email({ message: "Inserisci un'email valida" }),
  password: z
    .string()
    .min(1, { message: "La password è obbligatoria" })
    .min(6, { message: "La password deve essere di almeno 6 caratteri" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message:
        "La password deve contenere almeno una lettera maiuscola, una minuscola e un numero",
    }),
});

export const profileUpdateSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Il nome deve essere di almeno 2 caratteri" })
      .optional()
      .or(z.literal("")),
    email: z
      .string()
      .email({ message: "Inserisci un'email valida" })
      .optional()
      .or(z.literal("")),
    currentPassword: z.string().optional().or(z.literal("")),
    newPassword: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => {
          if (!val || val === "") return true;
          return val.length >= 6;
        },
        { message: "La password deve essere di almeno 6 caratteri" }
      )
      .refine(
        (val) => {
          if (!val || val === "") return true;
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val);
        },
        {
          message:
            "La password deve contenere almeno una lettera maiuscola, una minuscola e un numero",
        }
      ),
  })
  .refine(
    (data) => {
      if (
        data.newPassword &&
        data.newPassword !== "" &&
        (!data.currentPassword || data.currentPassword === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "La password attuale è obbligatoria per cambiarla",
      path: ["currentPassword"],
    }
  );

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
