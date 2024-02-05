import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import {
  Button,
  Form,
  Modal,
  Table,
  Row,
  Col,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  addProduct,
  deleteProduct,
  getProducts,
  productSelectors,
  updateFilters,
  updateProduct,
} from "../features/productSlice";
import { categorySelectors, getCategories } from "../features/categorySlice";
import { getTags, tagSelectors } from "../features/tagSlice";
import { Link } from "react-router-dom";

const ManageProducts = () => {
  const products = useSelector(productSelectors.selectAll);
  const categories = useSelector(categorySelectors.selectAll);
  const tags = useSelector(tagSelectors.selectAll);
  const { totalPage, totalItem } = useSelector((state) => state.product.page);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const dispatch = useDispatch();
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [image, setImage] = useState(null);

  const [editedProduct, setEditedProduct] = useState({});

  const [submitAlert, setSubmitAlert] = useState(false);
  const [updateAlert, setUpdateAlert] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState();

  useEffect(() => {
    dispatch(
      getProducts({
        skip,
        selectedCategory: null,
        selectedTags: [],
        searchTerm: "",
      })
    );
  }, [dispatch, skip, selectedCategory, selectedTags, searchTerm]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTags());
  }, [dispatch]);

  const handleFilterTag = async (tagId) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    } else {
      const updatedTags = selectedTags.filter((id) => id !== tagId);
      setSelectedTags(updatedTags);
    }
  };

  const openModalAdd = () => setModalAdd(true);
  const closeModalAdd = () => setModalAdd(false);

  const openModalUpdate = () => setModalUpdate(true);
  const closeModalUpdate = () => setModalUpdate(false);

  const openModalDelete = () => {
    setModalDelete(true);
  };
  const closeModalDelete = () => setModalDelete(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log(editedProduct);
      await dispatch(updateProduct(editedProduct));
      await dispatch(
        getProducts({
          skip,
          selectedCategory: null,
          selectedTags: [],
          searchTerm: "",
        })
      );
      closeModalUpdate();
      setUpdateAlert(true);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name: productName,
        description,
        price,
        category,
        tag,
        image,
      };
      console.log(productData);
      await dispatch(addProduct(productData));
      await dispatch(
        getProducts({
          skip,
          selectedCategory: null,
          selectedTags: [],
          searchTerm: "",
        })
      );
      closeModalAdd();
      setSubmitAlert(true);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const openUpdate = (productId) => {
    let data = products && products.find((p) => p._id === productId);
    setEditedProduct(data);
    openModalUpdate();
  };

  const openDeleteConfirm = (productId) => {
    setItemToDelete(productId);
    openModalDelete(productId);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteProduct(itemToDelete));
      await dispatch(
        getProducts({
          skip,
          selectedCategory: null,
          selectedTags: [],
          searchTerm: "",
        })
      );
      closeModalDelete();
      setDeleteAlert(true);
    } catch (error) {
      console.error(error);
    }
  };

  const previous = () => {
    const newSkip = skip - 6 < 0 ? 0 : skip - 6;

    dispatch(
      getProducts({
        skip: newSkip,
        selectedCategory,
        selectedTags,
        searchTerm,
      })
    );

    setCurrentPage(currentPage <= 1 ? 1 : currentPage - 1);
    setSkip(newSkip);
  };

  const next = () => {
    const newSkip = skip + 6 < totalItem ? skip + 6 : skip;

    dispatch(
      getProducts({
        skip: newSkip,
        selectedCategory,
        selectedTags,
        searchTerm,
      })
    );

    setCurrentPage(currentPage === totalPage ? totalPage : currentPage + 1);
    setSkip(newSkip);
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    dispatch(updateFilters({ selectedCategory, selectedTags, searchTerm }));
    await dispatch(
      getProducts({ skip, selectedCategory, selectedTags, searchTerm: "" })
    );
    setCurrentPage(1);
  };

  return (
    <>
      <Navigation />
      <div className="container">
        <div className="row mt-3">
          <div className="filter-products col-lg-3 p-3 shadow h-50">
            <div className="form-search mb-2">
              <Form.Label className="fw-bold">Form pencarian</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Cari produk"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={handleFilter} className="btn btn-primary">
                  Cari
                </Button>
              </InputGroup>
            </div>
            <div className="filter-category mb-2">
              <Form.Label className="fw-bold">Filter Kategori</Form.Label>
              <Form.Select
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Semua kategori</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className="filter-tags mb-2">
              <Form.Label className="fw-bold">Filter Tags</Form.Label>
              <div className="row px-3">
                {tags.map((tag) => (
                  <div key={tag._id} className="form-check col-auto">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={tag.name}
                      id={tag._id}
                      checked={selectedTags.includes(tag.name)}
                      onChange={(e) => handleFilterTag(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor={tag._id}>
                      {tag.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="submit-btn">
              <Button
                onClick={handleFilter}
                className="btn btn-sm btn-primary w-100"
              >
                <i className="fa-solid fa-magnifying-glass"></i> Filter Sekarang
              </Button>
            </div>
          </div>
          <div className="products-wrapper col-lg-9 p-3">
            <div className="row mb-2">
              <div className=" col-lg-4">
                <Button
                  onClick={openModalAdd}
                  className="btn btn-primary w-100"
                >
                  <i className="fa-solid fa-square-plus"></i> Tambah produk
                </Button>
              </div>
              {/* <div className="col-lg-2">
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    <i className="fa-solid fa-gear"></i> Kelola lainnya
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/manage-products">
                      Produk
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/manage-categories">
                      Kategori
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/manage-tags">
                      Tag
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div> */}
            </div>
            <div>
              {submitAlert && (
                <div
                  className="alert alert-success alert-dismissible fade show"
                  role="alert"
                >
                  Data berhasil ditambahkan!
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    onClick={() => setSubmitAlert(false)}
                  ></button>
                </div>
              )}
              {updateAlert && (
                <div
                  className="alert alert-success alert-dismissible fade show"
                  role="alert"
                >
                  Data berhasil diperbarui!
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    onClick={() => setUpdateAlert(false)}
                  ></button>
                </div>
              )}
              {deleteAlert && (
                <div
                  className="alert alert-success alert-dismissible fade show"
                  role="alert"
                >
                  Data berhasil dihapus!
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    onClick={() => setDeleteAlert(false)}
                  ></button>
                </div>
              )}
            </div>
            <div className="table-wrapper shadow">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Gambar</th>
                    <th>Nama</th>
                    <th>Kategori</th>
                    <th>Tags</th>
                    <th>Deskripsi</th>
                    <th>Harga</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product, index) => (
                      <tr key={product._id}>
                        <td>{index + 1}</td>
                        <td>
                          <img
                            src={`http://localhost:3000/gambar/${product.image_url}`}
                            height={100}
                            alt={product.name}
                            className="w-100 mb-2"
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.category?.name}</td>
                        <td>
                          <div>
                            {product.tags.map((tag, index) => (
                              <div key={tag._id}>
                                <h6>
                                  <Badge bg="secondary">{tag.name}</Badge>
                                </h6>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td>{product.description}</td>
                        <td>
                          Rp.{" "}
                          {product.price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        </td>
                        <td>
                          <Link
                            to={`/product/${product._id}`}
                            className="btn btn-primary btn-sm"
                          >
                            <i className="fa-solid fa-eye"></i>
                          </Link>
                          <Button
                            onClick={() => openUpdate(product._id)}
                            className="btn btn-warning btn-sm mx-2"
                          >
                            <i className="fa-solid fa-pen-to-square text-light"></i>
                          </Button>
                          <Button
                            onClick={() => openDeleteConfirm(product._id)}
                            className="btn btn-danger btn-sm"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="fw-bold text-center">
                      <td colSpan={8}>Produk tidak ditemukan</td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <div className="pagination-wrapper py-5">
                <nav className="container mt-3 text-center">
                  <ul className="pagination justify-content-center">
                    <li className="page-item">
                      <button
                        className="btn btn-primary"
                        onClick={previous}
                        disabled={currentPage <= 1}
                      >
                        Sebelumnya
                      </button>
                    </li>
                    <li className="page-item fs-5 fw-bold mx-2">
                      {currentPage} / {totalPage}
                    </li>
                    <li className="page-item">
                      <button
                        className="btn btn-primary"
                        onClick={next}
                        disabled={currentPage >= totalPage}
                      >
                        Selanjutnya
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={modalAdd} onHide={closeModalAdd}>
        <Modal.Header className="bg-success" closeButton>
          <Modal.Title className="fw-bold">Tambah Produk</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Nama</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nama produk"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Deskripsi"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Harga</Form.Label>
              <Form.Control
                type="number"
                placeholder="Harga"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Kategori</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Pilih kategori</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name.charAt(0).toUpperCase() + c.name.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Tag</Form.Label>
              <Row>
                {tags.map((t) => (
                  <Col key={t._id} xs={12} md={4}>
                    <Form.Check
                      key={t._id}
                      type="checkbox"
                      label={t.name.charAt(0).toUpperCase() + t.name.slice(1)}
                      id={t.name}
                      checked={tag.includes(t.name)}
                      onChange={(e) => {
                        const selectedTagName = e.target.id;
                        const isChecked = e.target.checked;
                        if (isChecked) {
                          setTag((prevTags) => [...prevTags, selectedTagName]);
                        } else {
                          setTag((prevTags) =>
                            prevTags.filter(
                              (tagName) => tagName !== selectedTagName
                            )
                          );
                        }
                      }}
                    />
                  </Col>
                ))}
              </Row>
            </Form.Group>
            <Form.Group className="position-relative mb-3">
              <Form.Label className="fw-bold">Gambar</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
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
        <Modal.Header closeButton className="bg-success">
          <Modal.Title className="fw-bold">Update Produk</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nama produk"
                value={editedProduct.name || ""}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Deskripsi"
                value={editedProduct.description || ""}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    description: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Harga</Form.Label>
              <Form.Control
                type="number"
                placeholder="Harga"
                value={editedProduct.price || ""}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, price: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Kategori</Form.Label>
              <Form.Select
                value={editedProduct.category && editedProduct.category.name}
                onChange={(e) => {
                  setEditedProduct({
                    ...editedProduct,
                    category: e.target.value,
                  });
                }}
                required
              >
                <option value="">Pilih kategori</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name.charAt(0).toUpperCase() + c.name.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Tag</Form.Label>
              <Row>
                {tags.map((t) => (
                  <Col key={t._id} xs={12} md={4}>
                    <Form.Check
                      key={t._id}
                      type="checkbox"
                      label={t.name.charAt(0).toUpperCase() + t.name.slice(1)}
                      id={t.name}
                      checked={
                        editedProduct.tags &&
                        editedProduct.tags.some((tag) => tag._id === t._id)
                      }
                      onChange={(e) => {
                        const selectedTagName = t.name;
                        const isChecked = e.target.checked;

                        setEditedProduct((prev) => {
                          const prevTags = prev.tags;

                          if (isChecked) {
                            return {
                              ...prev,
                              tags: [
                                ...prevTags,
                                { _id: t._id, name: selectedTagName },
                              ],
                            };
                          } else {
                            return {
                              ...prev,
                              tags: prevTags.filter(
                                (tag) => tag.name !== selectedTagName
                              ),
                            };
                          }
                        });
                      }}
                    />
                  </Col>
                ))}
              </Row>
            </Form.Group>
            <Form.Group className="position-relative mb-3">
              <Form.Label className="fw-bold">Gambar</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => {
                  setEditedProduct({
                    ...editedProduct,
                    image: e.target.files[0],
                  });
                }}
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

      <Modal show={modalDelete} onHide={closeModalDelete}>
        <Modal.Header closeButton className="bg-success">
          <Modal.Title className="fw-bold">Konfirmasi</Modal.Title>
        </Modal.Header>
        <Modal.Body>Yakin ingin menghapus data?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModalDelete}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageProducts;
