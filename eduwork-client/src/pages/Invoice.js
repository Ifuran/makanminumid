import React, { useEffect } from "react";
import Navigation from "../components/Navigation";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getInvoice, invoiceSelectors } from "../features/invoiceSlice";
import { userSelectors } from "../features/userSlice";

const Invoice = () => {
  const { invoiceId } = useParams();
  const dispatch = useDispatch();

  const { invoice } = useSelector((state) => state.invoice);

  useEffect(() => {
    dispatch(getInvoice(invoiceId));
  }, [dispatch]);

  return (
    <>
      <Navigation />
      <div className="container">
        <div className="row">
          {invoice && (
            <div className="mx-auto col-lg-8 shadow p-5 mt-5 card-wrapper">
              <h2 className="fw-bold mb-3 text-center">Invoice</h2>
              <table className="table table-hover">
                <tbody>
                  <tr>
                    <td>Status</td>
                    <td>: {invoice.payment_status}</td>
                  </tr>
                  <tr>
                    <td>Total Harga</td>
                    <td>
                      : Rp.{" "}
                      {invoice.sub_total
                        ? invoice.sub_total
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td>Alamat Pengiriman</td>
                    <td>
                      : {invoice.delivery_address?.provinsi},{" "}
                      {invoice.delivery_address?.kabupaten},{" "}
                      {invoice.delivery_address?.kecamatan},{" "}
                      {invoice.delivery_address?.kelurahan}, (
                      {invoice.delivery_address?.detail})
                    </td>
                  </tr>
                  <tr>
                    <td>Tujuan Pembayaran</td>
                    <td>: BNI 1903-0361-68xx-xxxx An. Ifran Silalahi</td>
                  </tr>
                </tbody>
              </table>
              <Link to="/account" className="btn btn-primary w-100">
                <i className="fa-solid fa-cart-shopping"></i> Lihat Pesanan
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Invoice;
