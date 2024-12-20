"use client";
import React, { useEffect, useState } from "react";
import AddManager from "../components/add-manager/AddManager";
import AuthHOC from "../components/hoc/AuthHOC";
import { doSignOut, getSelectObjects } from "../services/api/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Dropdown } from "react-bootstrap";
import Loadingx from "../components/ui/Loadingx";
import Hamburger from "hamburger-react";

const Home = () => {
  const router = useRouter();
  const [selectObjs, setSelectObjs] = useState([]);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const getSelectObjectsFromServer = async () => {
      try {
        const data = await getSelectObjects();
        setSelectObjs(data);
      } catch (error) {
        const elseError = "مشکلی در دریافت مقادیر انتخابی به وجود امده است";
        errorHandler(router, error, elseError);
      }
    };

    getSelectObjectsFromServer();
  }, []);

  const errorHandler = (router, error, elseError) => {
    if (error.response && error.response.status === 400) {
      toast.error(error.response.data.error);
    } else if (error.response && error.response.status === 403) {
      toast.error("فراخوانی اطلاعات با عدم دسترسی");
      router.replace("/access-denied");
    } else if (error.response && error.response.status === 401) {
      toast.error("توکن شما منقضی شده است. دوباره وارد حساب خود شوید");
      router.replace("/auth/login");
    } else {
      toast.error(elseError);
    }
  };

  const signOut = async () => {
    try {
      await doSignOut();
      
      toast.success("از حساب خود خارج شدید");
      setIsSigningOut(true);
      router.push("/");
    } catch (error) {
      const elseError = "مشکلی در خروج از حساب ایجاد شده است";
      errorHandler(router, error, elseError);
    }finally{
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpire");
      localStorage.removeItem("roles");
    }
  };

  const [isOpen, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(!isOpen);
  };

  if (isSigningOut) {
    return <Loadingx variant={"primary"} />;
  }

  return (
    <>
      <div className="wrapper">
        <div className="header-title-p"></div>
        <div className="main">
          <nav className="navbar navbar-expand navbar-theme mx-2">
            <Dropdown show={isOpen} onToggle={toggleMenu}>
            <Hamburger  size={25}   color="#ffffff"  toggled={isOpen} toggle={toggleMenu} />
              <Dropdown.Menu
                style={{
                  direction: "rtl",
                  textAlign: "right",
                  fontFamily: "__iransans_7c92e5",
                }}
              >
                <>
                  <Dropdown.Item href="/">صفحه اصلی</Dropdown.Item>
                  {JSON.parse(localStorage.getItem("roles"))[0] ===
                    "organManager" && (
                    <Dropdown.Item href="/organ-manager">
                      صفحه مدیریت دستگاه
                    </Dropdown.Item>
                  )}

                  <Dropdown.Item onClick={signOut}>خروج از حساب</Dropdown.Item>
                </>
              </Dropdown.Menu>
            </Dropdown>
          </nav>
          <div className="content">
            <div className="container-fluid">
              <div className="header text-left">
                <h1 className="header-title"></h1>
                <p className="header-subtitle"></p>
              </div>
              <div className="row mt-4">
                <div>
                  <div className="row mt-5">
                    <div className="col-xl-12">
                      <div className="card m-card p-0 m-0">
                        <div className="card-header bg-white">
                          <h5 className="card-title">ثبت یا ویرایش اطلاعات</h5>
                        </div>
                        <div className="card-body p-2 mt-3 mb-3">
                          <AddManager selectObjs={selectObjs} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="footer mt-5">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 text-center pt-4">
                  <p className="text-white fs-6">
                    کلیه حقوق مادی و معنوی برای استانداری کردستان محفوظ است
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default AuthHOC(Home);
