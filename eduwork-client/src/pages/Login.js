import React, { useState } from "react";
import Navigation from "../components/Navigation";
import { Button, Form, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showAlert, setShowAlert] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const userCredentials = {
      email,
      password,
    };
    const response = await dispatch(loginUser(userCredentials));
    response.payload.error ? setShowAlert(true) : navigate("/");
  };

  return (
    <>
      <Navigation />
      <div className="container">
        <div className="row">
          <Form
            onSubmit={handleLogin}
            className="mx-auto col-lg-6 shadow p-5 mt-5 "
          >
            {showAlert && (
              <Alert
                variant={"danger"}
                onClose={() => setShowAlert(false)}
                dismissible
              >
                Email atau Password salah!
              </Alert>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Button variant="primary" type="submit" className="w-100">
                Submit
              </Button>
            </Form.Group>
            <small className="text-underline">
              Belum punya akun? <Link to={"/signup"}>Buat akun</Link>
            </small>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
