//@ts-nocheck
import { login } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../../utils/jwt";
import { getToken } from "../../services/auth";
import './Login.css';


export default function Login() {
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const mat_khau = e.target.password.value;

    const res = await login(email, mat_khau);
    if (!res.success) return alert(res.message);

    const payload = decodeToken(getToken());
    if (payload.loai_tai_khoan === "admin") navigate("/admin");
    else if (payload.loai_tai_khoan === "chu_san") navigate("/owner");
    else navigate("/login");
  }

  function loginGoogle() {
    // window.location.href = "http://localhost:3000/api/auth/google";
    window.location.href = (import.meta.env.VITE_API_BASE_URL || "") + "/api/auth/google";
  }

  return (
    <>
  <main className="main-content  mt-0">
    <section>
      <div className="page-header min-vh-75">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
              <div className="card card-plain mt-8">
                <div className="card-header pb-0 text-left bg-transparent">
                  <h3 className="font-weight-bolder text-info text-gradient">Welcome back</h3>
                  <p className="mb-0">Enter your email and password to sign in</p>
                </div>
                <div className="card-body">
                  <form role="form" onSubmit={handleSubmit}>
                    <label>Email</label>
                    <div className="mb-3">
                      <input type="email" name="email" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="email-addon"/>
                    </div>
                    <label>Password</label>
                    <div className="mb-3">
                      <input type="password" name="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="password-addon"/>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="rememberMe" defaultChecked={true}/>
                      <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                    </div>
                    <div className="text-center">
                      <button type="submit" className="btn bg-gradient-info w-100 mt-4 mb-0">Sign in</button>
                    </div>
                  </form>
                </div>
                <div className="card-footer text-center pt-0 px-lg-2 px-1">
                 
                  <p className="mb-0 mt-3 text-sm text-center">
                    Sign in with{" "}
                    <span 
                      onClick={loginGoogle} 
                      className="text-danger font-weight-bold" 
                      style={{ cursor: "pointer" }} // Thêm cursor để chuột biến thành hình bàn tay
                    >
                      Google
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="  col-md-6">
              <div className="oblique position-absolute top-0 h-100 d-md-block d-none me-n8">
                <div className="oblique-image bg-cover position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6" 
                style={{ backgroundImage: "url('/assets/img/curved-images/curved6.jpg')",backgroundSize: "cover" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

    </>
  );
}
