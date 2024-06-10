import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navigation from "../components/Navigation";
import { Button, Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  addToCart,
  getProducts,
  productSelectors,
  updateFilters,
} from "../features/productSlice";
import { getCategories, categorySelectors } from "../features/categorySlice";
import { getTags, tagSelectors } from "../features/tagSlice";
import { getUser, userSelectors } from "../features/userSlice";

const Product = () => {
  const dispatch = useDispatch();
  const products = useSelector(productSelectors.selectAll);
  const categories = useSelector(categorySelectors.selectAll);
  const tags = useSelector(tagSelectors.selectAll);
  const user = useSelector(userSelectors.selectAll);
  const { totalPage, totalItem } = useSelector((state) => state.product.page);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleFilterTag = async (tagId) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    } else {
      const updatedTags = selectedTags.filter((id) => id !== tagId);
      setSelectedTags(updatedTags);
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
    setSkip(0);
    dispatch(updateFilters({ selectedCategory, selectedTags, searchTerm }));
    await dispatch(
      getProducts({ skip, selectedCategory, selectedTags, searchTerm: "" })
    );
    setCurrentPage(1);
  };

  return (
    <>
      <Navigation cartCount={0} />
      <div className="container">
        <div className="row mt-3">
          <div className="filter-products col-lg-3 p-3 shadow h-50">
            {user && user.length > 0 && user[0].role === "admin" && (
              <div className="feature-admin mb-2">
                <Form.Label className="fw-bold">Fitur Admin</Form.Label>
                <Link
                  to={`/manage-products`}
                  className="btn btn-sm btn-primary w-100"
                >
                  <i className="fa-solid fa-gear"></i> Kelola data
                </Link>
              </div>
            )}
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
            <div className="row">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    className="col-lg-4 col-md-4 col-sm-6 card-wrapper"
                    key={product._id}
                  >
                    <div className="p-2 mb-2 card-item shadow">
                      <img
                        src={`http://localhost:3000/gambar/${product.image_url}`}
                        height={150}
                        alt={product.name}
                        className="w-100 mb-2"
                      />
                      <h6>{product.name}</h6>
                      <h6>
                        Rp.{" "}
                        {product.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </h6>
                      <Link
                        to={`../product/${product._id}`}
                        className="btn btn-sm btn-primary"
                      >
                        <i className="fa-solid fa-eye"></i> Lihat
                      </Link>
                      {user && user.length > 0 && user[0].role === "user" && (
                        <button
                          onClick={() => dispatch(addToCart(product))}
                          className="btn btn-sm btn-primary ms-2"
                        >
                          <i className="fa-solid fa-cart-shopping"></i>{" "}
                          Keranjang
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="fw-bold text-center">
                  Produk tidak ditemukan
                </div>
              )}
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
    </>
  );
};

export default Product;
