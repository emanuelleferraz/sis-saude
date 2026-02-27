"use client";

import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    
    if (!token) {
      router.replace("/login");
      return;
    }

    
    if (allowedRoles) {
      const decoded: any = jwtDecode(token);

      if (!allowedRoles.includes(decoded.role)) {
        router.replace("/403");
      }
    }
  }, []);

  return <>{children}</>;
}