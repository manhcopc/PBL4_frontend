import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
export default function Login() {
  return (
    <>
      <main
        style={{
          backgroundColor: "gray",
          // display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          margin: "0 auto",
        }}
        className="d-flex form-signin w-100 m-auto"
      >
        {" "}
        <form className="w-50 m-auto"
          style={{
            padding: "1rem",
            maxWidth: "330px",
            backgroundColor: "white",
            borderRadius: "8px",
          }}
        >
          {" "}
          {/* <img
            className="mb-4"
            src="/docs/5.3/assets/brand/bootstrap-logo.svg"
            alt=""
            width="72"
            height="57"
          />{" "} */}
          <h1 style={{ textTransform: "uppercase", fontWeight: "bold" }} className="d-flex justify-content-center h3 mb-3 fw-normal">
            Log in
          </h1>{" "}
          <div className="form-floating mb-2 w-">
            {" "}
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              required
            />{" "}
            <label htmlFor="floatingInput">Email address</label>{" "}
          </div>{" "}
          <div className="form-floating">
            {" "}
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              required
            />{" "}
            <label htmlFor="floatingPassword">Password</label>{" "}
          </div>{" "}
          <div className="form-check text-start my-3">
            {" "}
            <input
              className="form-check-input"
              type="checkbox"
              value="remember-me"
              id="checkDefault"
            />{" "}
            <label className="form-check-label" htmlFor="checkDefault">
              Remember me
            </label>{" "}
          </div>{" "}
          <button className="btn btn-primary w-100 py-2" type="submit">
            Sign in
          </button>{" "}
          {/* <p className="mt-5 mb-3 text-body-secondary">© 2017–2025</p>{" "} */}
        </form>{" "}
      </main>
    </>
  );
}
