import { Outlet } from "react-router-dom";
import { useEffect } from "react";

export default function AuthLayout({ children }: { children?: React.ReactNode }) {
  useEffect(() => {

    document.body.classList.remove("g-sidenav-show");

    return () => {

    };
  }, []);

  return <>
    {children}
    <Outlet />
  </>
}