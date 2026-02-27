"use client";

import { useRouter } from "next/navigation";
import { useEffect, ReactNode, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (allowedRoles) {
      try {
        const decoded: any = jwtDecode(token);
        if (!allowedRoles.includes(decoded.role)) {
          router.replace("/403");
          return;
        }
      } catch {
        router.replace("/login");
        return;
      }
    }

    setChecking(false);
  }, []);

  if (checking) {
    return <div>Carregando...</div>;
  }

  return <>{children}</>;
}