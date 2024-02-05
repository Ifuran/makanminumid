import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, userSelectors } from "../features/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { Accordion, Button, Form, Modal } from "react-bootstrap";
import {
  addAddress,
  addressSelectors,
  getAddress,
  getKabupaten,
  getKecamatan,
  getKelurahan,
  getProvinsi,
  updateAddress,
} from "../features/addressSlice";
import { getOrder } from "../features/orderSlice";

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(userSelectors.selectAll);
  const address = useSelector(addressSelectors.selectAll);
  const order = useSelector((state) => state.order.order);
  const { provinsi } = useSelector((state) => state.address.indonesia);
  const { kabupaten } = useSelector((state) => state.address.indonesia);
  const { kecamatan } = useSelector((state) => state.address.indonesia);
  const { kelurahan } = useSelector((state) => state.address.indonesia);

  const [modalAdd, setModalAdd] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);

  const [nama, setNama] = useState("");
  const [alamatKelurahan, setAlamatKelurahan] = useState("");
  const [alamatKecamatan, setAlamatKecamatan] = useState("");
  const [alamatKabupaten, setAlamatKabupaten] = useState("");
  const [alamatProvinsi, setAlamatProvinsi] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  const [editedAddress, setEditedAddress] = useState();

  useEffect(() => {
    dispatch(getProvinsi());
    dispatch(getAddress());
    dispatch(getOrder());
  }, [dispatch]);

  const openModalAdd = () => setModalAdd(true);
  const closeModalAdd = () => setModalAdd(false);

  const openModalUpdate = async () => {
    await setEditedAddress(address[0]);
    setModalUpdate(true);
  };
  const closeModalUpdate = () => setModalUpdate(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    const userCredentials = {
      email: user[0].email,
      password: user[0].password,
    };
    await dispatch(logoutUser(userCredentials));
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const address = {
      name: nama,
      provinsi: alamatProvinsi,
      kabupaten: alamatKabupaten,
      kecamatan: alamatKecamatan,
      kelurahan: alamatKelurahan,
      detail: detailAddress,
    };
    await dispatch(addAddress(address));
    await dispatch(getAddress());

    closeModalAdd();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await dispatch(updateAddress(editedAddress));
    await dispatch(getAddress());
    closeModalUpdate();
  };

  const calculateTotalPrice = (product) => {
    return (
      product?.cart?.reduce((total, item) => total + item.price * item.qty, 0) +
      product?.delivery_fee
    )
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <>
      <Navigation />
      <div className="container">
        <div className="account-wrapper row mt-3">
          <div className="col-lg-4">
            <div className="profile py-5 px-3 shadow">
              <h3 className="fw-bold mb-3">Profile Saya</h3>
              <table className="table table-hover">
                {user && user.length > 0 && (
                  <tbody>
                    <tr>
                      <td>Nama :</td>
                      <td>{user[0].full_name}</td>
                    </tr>
                    <tr>
                      <td>Email :</td>
                      <td>{user[0].email}</td>
                    </tr>
                  </tbody>
                )}
              </table>
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-danger mt-2"
              >
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </button>
            </div>
          </div>
          {user && user.length > 0 && user[0].role === "user" && (
            <div className="col-lg-8">
              <div className="orders py-5 px-3 shadow">
                <h3 className="fw-bold mb-3">Alamat Saya</h3>
                {address.length > 0 ? (
                  address.map((row) => (
                    <div className="row" key={row._id}>
                      <div className="col-3">{row.name} </div>
                      <div className="col-6">
                        : {row.provinsi}, {row.kabupaten}, {row.kecamatan},{" "}
                        {row.kelurahan}, {row.detail}
                      </div>
                      <div className="col-3">
                        <button
                          onClick={() => openModalUpdate(row)}
                          className="btn btn-sm btn-primary mt-2"
                        >
                          <i className="fa-solid fa-pencil"></i> Edit
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-lg-2">
                    <button
                      onClick={openModalAdd}
                      className="btn btn-sm btn-primary mt-2"
                    >
                      <i className="fa-solid fa-plus"></i> Tambah Alamat
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="row mt-3">
          {user && user.length > 0 && user[0].role === "user" && (
            <div className="col">
              <div className="orders py-5 px-3 shadow">
                <h3 className="fw-bold mb-3">Pesanan Saya</h3>
                {order.length > 0 ? (
                  order?.map((product, index) => (
                    <div
                      className="row clickable"
                      key={product._id}
                      data-toggle="collapse"
                      data-target="#accordion"
                    >
                      <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <div className="col">
                              {index + 1}.{" "}
                              {new Date(product.createdAt).toLocaleDateString(
                                "id-ID",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  weekday: "long",
                                }
                              )}
                            </div>
                            <div className="col">
                              Rp. {calculateTotalPrice(product)}
                            </div>
                            <div className="col">{product.status}</div>
                            <div className="col z-3">
                              <Link
                                to={`/invoice/${product._id}`}
                                className="btn btn-sm btn-primary"
                              >
                                Invoice
                              </Link>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            <table className="table">
                              <thead>
                                <tr>
                                  <th scope="col">Nama</th>
                                  <th scope="col">Jumlah</th>
                                  <th scope="col">Harga</th>
                                  <th scope="col">Aksi</th>
                                </tr>
                              </thead>
                              <tbody>
                                {product?.cart?.map((item, itemIndex) => (
                                  <tr key={item._id}>
                                    <td>{item.name}</td>
                                    <td>{item.qty}</td>
                                    <td>
                                      Rp.{" "}
                                      {item.price
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                    </td>
                                    <td>
                                      <Link
                                        to={`../product/${item._id}`}
                                        className="btn btn-sm btn-primary"
                                      >
                                        <i className="fa-solid fa-eye"></i>{" "}
                                        Lihat
                                      </Link>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </div>
                  ))
                ) : (
                  <div className="text-center fw-bold py-3">
                    Belum ada pesanan
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal show={modalAdd} onHide={closeModalAdd}>
        <Modal.Header className="bg-success" closeButton>
          <Modal.Title className="fw-bold">Tambah Alamat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Nama</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Provinsi</Form.Label>
              <Form.Select
                value={alamatProvinsi}
                onChange={(e) => {
                  const selectedOption =
                    e.target.options[e.target.selectedIndex];
                  const selectedId = selectedOption.getAttribute("data-id");
                  setAlamatProvinsi(e.target.value);
                  dispatch(getKabupaten(selectedId));
                }}
                required
              >
                <option value="">Pilih provinsi</option>
                {provinsi &&
                  provinsi.map((p) => (
                    <option key={p.id} data-id={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Kabupaten</Form.Label>
              <Form.Select
                value={alamatKabupaten}
                onChange={(e) => {
                  const selectedOption =
                    e.target.options[e.target.selectedIndex];
                  const selectedId = selectedOption.getAttribute("data-id");
                  setAlamatKabupaten(e.target.value);
                  dispatch(getKecamatan(selectedId));
                }}
                required
              >
                <option value="">Pilih kabupaten</option>
                {kabupaten &&
                  kabupaten.map((k) => (
                    <option key={k.id} data-id={k.id} value={k.name}>
                      {k.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Kecamantan</Form.Label>
              <Form.Select
                value={alamatKecamatan}
                onChange={(e) => {
                  const selectedOption =
                    e.target.options[e.target.selectedIndex];
                  const selectedId = selectedOption.getAttribute("data-id");
                  setAlamatKecamatan(e.target.value);
                  dispatch(getKelurahan(selectedId));
                }}
                required
              >
                <option value="">Pilih kecamatan</option>
                {kecamatan &&
                  kecamatan.map((k) => (
                    <option key={k.id} data-id={k.id} value={k.name}>
                      {k.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Kelurahan</Form.Label>
              <Form.Select
                value={alamatKelurahan}
                onChange={(e) => {
                  setAlamatKelurahan(e.target.value);
                }}
                required
              >
                <option value="">Pilih kelurahan</option>
                {kelurahan &&
                  kelurahan.map((k) => (
                    <option key={k.id} value={k.name}>
                      {k.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Detail</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Detail alamat"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Button
                variant="primary"
                type="submit"
                className="d-block btn-block w-100"
              >
                Submit
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={modalUpdate} onHide={closeModalUpdate}>
        <Modal.Header className="bg-success" closeButton>
          <Modal.Title className="fw-bold">Edit Alamat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Nama</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nama"
                value={editedAddress && editedAddress.name}
                onChange={(e) =>
                  setEditedAddress({ ...editedAddress, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Provinsi</Form.Label>
              <Form.Select
                value={editedAddress && editedAddress.provinsi}
                onChange={(e) => {
                  const selectedOption =
                    e.target.options[e.target.selectedIndex];
                  const selectedId = selectedOption.getAttribute("data-id");
                  setEditedAddress({
                    ...editedAddress,
                    provinsi: e.target.value,
                  });
                  dispatch(getKabupaten(selectedId));
                }}
                required
              >
                <option value="">Pilih provinsi</option>
                {provinsi &&
                  provinsi.map((p) => (
                    <option key={p.id} data-id={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Kabupaten</Form.Label>
              <Form.Select
                value={editedAddress && editedAddress.kabupaten}
                onChange={(e) => {
                  const selectedOption =
                    e.target.options[e.target.selectedIndex];
                  const selectedId = selectedOption.getAttribute("data-id");
                  setEditedAddress({
                    ...editedAddress,
                    kabupaten: e.target.value,
                  });
                  dispatch(getKecamatan(selectedId));
                }}
                required
              >
                <option value="">Pilih kabupaten</option>
                {kabupaten &&
                  kabupaten.map((k) => (
                    <option key={k.id} data-id={k.id} value={k.name}>
                      {k.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Kecamantan</Form.Label>
              <Form.Select
                value={editedAddress && editedAddress.kecamatan}
                onChange={(e) => {
                  const selectedOption =
                    e.target.options[e.target.selectedIndex];
                  const selectedId = selectedOption.getAttribute("data-id");
                  setEditedAddress({
                    ...editedAddress,
                    kecamatan: e.target.value,
                  });
                  dispatch(getKelurahan(selectedId));
                }}
                required
              >
                <option value="">Pilih kecamatan</option>
                {kecamatan &&
                  kecamatan.map((k) => (
                    <option key={k.id} data-id={k.id} value={k.name}>
                      {k.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Kelurahan</Form.Label>
              <Form.Select
                value={editedAddress && editedAddress.kelurahan}
                onChange={(e) => {
                  setEditedAddress({
                    ...editedAddress,
                    kelurahan: e.target.value,
                  });
                }}
                required
              >
                <option value="">Pilih kelurahan</option>
                {kelurahan &&
                  kelurahan.map((k) => (
                    <option key={k.id} value={k.name}>
                      {k.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Detail</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Detail alamat"
                value={editedAddress && editedAddress.detail}
                onChange={(e) =>
                  setEditedAddress({ ...editedAddress, detail: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Button
                variant="primary"
                type="submit"
                className="d-block btn-block w-100"
              >
                Submit
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Account;
