import { iransans } from "./fonts/font";
import "./globals.css";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";


export const metadata = {
  title: "سامانه نظارت بر انتصابات و اطلاعات مدیران استان کردستان",
  description: "سامانه نظارت بر انتصابات و اطلاعات مدیران استان کردستان",
};

export default function RootLayout({ children }) {
  return (
    <html dir="rtl" lang="fa" className={iransans.variable}>
      <body>
        {children}
        <ToastContainer
          rtl
          hideProgressBar
          position="top-left"
          autoClose={5000}
          transition={Zoom}
        />
      </body>
    </html>
  );
}
