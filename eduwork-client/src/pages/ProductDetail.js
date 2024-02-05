import React, { useEffect } from "react";
import Navigation from "../components/Navigation";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getProduct } from "../features/productSlice";
import { userSelectors } from "../features/userSlice";

const ProductDetail = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const { productDetail } = useSelector((state) => state.product);
  const user = useSelector(userSelectors.selectAll);

  useEffect(() => {
    dispatch(getProduct(productId));
  }, [dispatch, productId]);

  return (
    <>
      <Navigation />
      <div className="container">
        <div className="row">
          {productDetail && (
            <div className="mx-auto col-lg-6 shadow p-5 mt-5 card-wrapper">
              <img
                src={`http://localhost:3000/gambar/${productDetail.image_url}`}
                height={200}
                alt={productDetail.name}
                className="w-100 mb-2"
              />
              <table className="table table-hover">
                <tbody>
                  <tr>
                    <td>Nama</td>
                    <td>: {productDetail.name}</td>
                  </tr>
                  <tr>
                    <td>Kategori</td>
                    <td>: {productDetail.category?.name}</td>
                  </tr>
                  <tr>
                    <td>Tag</td>
                    <td>
                      :{" "}
                      {productDetail.tags?.map((tag, index) => (
                        <span key={tag._id}>
                          {tag.name}
                          {index < productDetail.tags.length - 1 && ", "}
                        </span>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>: {productDetail.description}</td>
                  </tr>
                  <tr>
                    <td>Harga</td>
                    <td>: Rp. {productDetail.price}</td>
                  </tr>
                </tbody>
              </table>
              {user && user.length > 0 && user[0].role === "user" && (
                <button
                  onClick={() => dispatch(addToCart(productDetail))}
                  className="btn btn-primary w-100"
                >
                  <i className="fa-solid fa-cart-shopping"></i> Keranjang
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
