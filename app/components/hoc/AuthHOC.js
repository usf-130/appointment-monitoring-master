"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import xaxios from "@/app/services/api/xaxios";
import Loadingx from "../ui/Loadingx";

const AuthHOC = (Component) => {
  const AuthResult = () => {
    const router = useRouter();
    const pathName = usePathname();
    const [canPass, setCanPass] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error(
          "برای دسترسی به این قسمت لازم است وارد حساب کاربری خود شوید"
        );
        router.replace("/auth/login");
        return;
      }

      const validateToken = async (pathName) => {
        try {
          const response = await xaxios.get(`/validate${pathName}`);
          if (response.status == 200) {
            setCanPass(true);
          }
        } catch (error) {
          if (error.response?.status === 403) {
            toast.error("شما اجازه ی ورود به این قسمت را ندارید");
            router.replace("/access-denied");
          } else {
            toast.error(
              "برای ورود به این قسمت لازم است دوباره وارد حساب کاربری خود شوید"
            );
            router.replace("/auth/login");
          }
        }
      };

      validateToken(pathName);
    }, []);

    return canPass ? <Component /> : <Loadingx />;
  };

  return AuthResult;
};

export default AuthHOC;
