import React, { useState } from "react";
import Navigation from "../components/Navigation";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../features/userSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const userCredentials = {
      email,
      fullName,
      password,
    };
    await dispatch(registerUser(userCredentials));
    navigate("/login");
  };

  return (
    <>
      <Navigation />
      <div className="container">
        <div className="row">
          <Form
            onSubmit={handleRegister}
            className="mx-auto col-lg-6 shadow p-5 mt-5 "
          >
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nama lengkap</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nama lengkap"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Button variant="primary" type="submit" className="w-100">
                Submit
              </Button>
            </Form.Group>
            <small className="text-underline">
              Sudah punya akun? <Link to={"/login"}>Login</Link>
            </small>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Signup;
