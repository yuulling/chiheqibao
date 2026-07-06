import { z } from "zod";

export const productCreateSchema = z.object({
  name: z.string().min(1, "产品名称不能为空").max(200),
  description: z.string().max(5000).nullable().optional(),
  specs: z.string().max(10000).optional().default("[]"),
  price: z.number().min(0).nullable().optional(),
  unit: z.string().max(20).optional().default("台"),
  categoryId: z.string().nullable().optional(),
  coverImage: z.string().max(500).nullable().optional(),
  images: z.string().max(5000).optional().default("[]"),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

export const productUpdateSchema = productCreateSchema.partial();

export const categorySchema = z.object({
  name: z.string().min(1, "分类名称不能为空").max(100),
  description: z.string().max(500).nullable().optional(),
  imageUrl: z.string().max(500).nullable().optional(),
  sortOrder: z.number().int().optional().default(0),
});

export const loginSchema = z.object({
  username: z.string().min(1, "用户名不能为空"),
  password: z.string().min(1, "密码不能为空"),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "请输入当前密码"),
  newPassword: z.string().min(6, "新密码至少6位").max(100),
  confirmPassword: z.string().min(1, "请确认新密码"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "两次密码输入不一致",
  path: ["confirmPassword"],
});

export const settingsKeys = [
  "companyName", "companyAddress", "companyPhone", "companyEmail",
  "homeBannerTitle", "homeBannerSubtitle", "aboutContent",
  "footerText", "icpNumber", "siteName", "siteDescription",
] as const;

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type LoginInput = z.infer<typeof loginSchema>;
