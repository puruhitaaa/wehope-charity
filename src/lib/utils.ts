import type { User } from "@clerk/nextjs/server";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function ny(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}

export const timestamps: { createdAt: true; updatedAt: true } = {
  createdAt: true,
  updatedAt: true,
};

export const currencyFormat = (n: number) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  return formatter.format(n);
};

export const filteredUser = (user: User) => {
  return {
    id: user.id,
    name: user.username
      ? user.username
      : user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.lastName
      ? user.lastName
      : user.firstName
      ? user.firstName
      : null,
    imageUrl: user.imageUrl,
    email: user.emailAddresses[0].emailAddress,
  };
};
