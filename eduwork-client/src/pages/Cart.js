import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementItem,
  incrementItem,
  removeItem,
  updateCart,
} from "../features/productSlice";
import { useNavigate } from "react-router-dom";
import { addressSelectors, getAddress } from "../features/addressSlice";
import { addOrder } from "../features/orderSlice";

const Cart = () => {
  const { cart } = useSelector((state) => state.product);
  const address = useSelector(addressSelectors.selectAll);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [modalCheckout, setModalCheckout] = useState(false);

  useEffect(() => {
    dispatch(getAddress());
  }, [dispatch]);

  const openModalCheckout = () => {
    setModalCheckout(true);
  };

  const closeModalCheckout = () => {
    setModalCheckout(false);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const cartItems = JSON.parse(localStorage.getItem("cart"));
    const deliveryFee = 0;
    const deliveryAddress = address[0]._id;
    const dataOrder = {
      delivery_fee: deliveryFee,
      delivery_address: deliveryAddress,
      cart: cartItems,
    };
    const response = await dispatch(addOrder(dataOrder));
    await dispatch(updateCart());
    closeModalCheckout();
    navigate(`/invoice/${response.payload.order._id}`);
  };

  return (
    <>
      <Navigation />
      <div className="container">
        <div className="table-wrapper mt-3 shadow">
          <Table striped bordered hover>
            <tbody>
              {cart
                ? cart.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img
                          src={`http://localhost:3000/gambar/${product.image_url}`}
                          height={50}
                          alt={product.name}
                          className="w-100"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => dispatch(decrementItem(product._id))}
                        >
                          <i className="fa-solid fa-minus"></i>
                        </button>
                        <span className="mx-3">{product.qty}</span>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => dispatch(incrementItem(product._id))}
                        >
                          <i className="fa-solid fa-plus"></i>
                        </button>
                      </td>
                      <td>
                        Rp.
                        {(product.price * product.qty)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => dispatch(removeItem(product._id))}
                        >
                          <i className="fa-solid fa-trash"></i> Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                : null}
              {cart.length ? (
                <tr>
                  <td colSpan={3} className="text-center fw-bold">
                    Total biaya
                  </td>
                  <td className="text-center fw-bold">
                    Rp.{" "}
                    {cart
                      .reduce((sum, product) => {
                        return sum + product.qty * product.price;
                      }, 0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={openModalCheckout}
                    >
                      Checkout
                    </button>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={5} className="text-center fw-bold py-3">
                    Keranjang kosong!
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
      <Modal show={modalCheckout} onHide={closeModalCheckout}>
        <Modal.Header closeButton className="bg-success">
          <Modal.Title className="fw-bold">Konfirmasi Pembelian</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCheckout}>
            {address.map((row) => (
              <Form.Group className="mb-3" key={row._id}>
                <Form.Label className="fw-bold">Alamat</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={
                    row.name +
                    " : " +
                    row.provinsi +
                    ", " +
                    row.kabupaten +
                    ", " +
                    row.kecamatan +
                    ", " +
                    row.kelurahan +
                    ", " +
                    row.detail
                  }
                  disabled
                />
              </Form.Group>
            ))}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Harga Total</Form.Label>
              <Form.Control
                type="text"
                value={
                  "Rp. " +
                  cart
                    .reduce((sum, product) => {
                      return sum + product.qty * product.price;
                    }, 0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Button
                variant="primary"
                type="submit"
                className="d-block btn-block w-100"
              >
                Konfirmasi
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Cart;
