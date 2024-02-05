import React, { useEffect } from "react";
import { Navbar, Container, Nav, NavLink, Badge } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getUser, userSelectors } from "../features/userSlice";
import { updateCart } from "../features/productSlice";

const Navigation = () => {
  const user = useSelector(userSelectors.selectAll);
  const { cart } = useSelector((state) => state.product);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
    dispatch(updateCart());
  }, [dispatch]);

  return (
    <>
      <Navbar expand="lg" className="bg-success">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold">
            MakanMinumID
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {user && user.length > 0 ? (
                <NavLink as={Link} to="/account" className="me-lg-3">
                  <i className="fa-solid fa-user"></i> {user[0].full_name}
                </NavLink>
              ) : (
                <NavLink as={Link} to="/login" className="me-lg-3">
                  <i className="fa-solid fa-user"></i> {"Login"}
                </NavLink>
              )}
              {user && user.length > 0 && user[0].role === "user" && (
                <NavLink as={Link} to="/cart">
                  {cart?.length ? (
                    <Badge bg="primary">{cart.length}</Badge>
                  ) : (
                    <></>
                  )}
                  <i className="fa-solid fa-cart-shopping"></i> Cart
                </NavLink>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
