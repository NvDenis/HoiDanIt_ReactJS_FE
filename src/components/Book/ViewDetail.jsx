import ImageGallery from "react-image-gallery";
import "./book.scss";
import { Col, Divider, Rate, Row } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import ModalGallery from "./ModalGallery";
import { useState } from "react";
import { useRef } from "react";
import BookLoader from "./BookLoader";
import { doAddBookAction } from "../../redux/order/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ViewDetail = (props) => {
  const refGallery = useRef(null);
  const [isShowModalGallery, setIsShowModalGallery] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);

  const { dataBook } = props;

  const images = dataBook?.images ?? [];

  const handleOnclickImage = () => {
    setIsShowModalGallery(true);
    setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value);
    if (!isNaN(newQuantity) && newQuantity <= dataBook.quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = (quantity, dataBook) => {
    if (isAuthenticated) {
      dispatch(
        doAddBookAction({ quantity, detail: dataBook, _id: dataBook._id })
      );
    } else {
      navigate("/login");
    }
  };

  return (
    <div style={{ padding: "20px 0", background: "#efefef" }}>
      <div
        className="view-detail-book"
        style={{ maxWidth: "1440px", margin: "0 auto" }}
      >
        {dataBook && dataBook._id ? (
          <Row gutter={[20, 20]}>
            <Col md={10} sm={0} xs={0}>
              <ImageGallery
                ref={refGallery}
                items={images}
                showPlayButton={false}
                showFullscreenButton={false}
                slideOnThumbnailOver={true}
                renderLeftNav={() => <></>}
                renderRightNav={() => <></>}
                onClick={() => handleOnclickImage()}
              />
            </Col>
            <Col md={14} sm={24} span={24}>
              <Col md={0} sm={24} xs={24}>
                <ImageGallery
                  items={images}
                  showPlayButton={false}
                  showFullscreenButton={false}
                  slideOnThumbnailOver={true}
                  renderLeftNav={() => <></>}
                  renderRightNav={() => <></>}
                />
              </Col>
              <Col
                span={24}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div className="author">
                  Tác giả: <a href="#">{dataBook.author}</a>
                </div>
                <div className="title">{dataBook.mainText}</div>
                <div className="rating">
                  <Rate value={5} disabled style={{ fontSize: "14px" }} />
                  <span className="sold">
                    <Divider type="vertical" />
                    <span>Đã bán: </span>
                    {dataBook.sold}
                  </span>
                </div>
                <div className="price">
                  <span className="currency">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(dataBook.price)}
                  </span>
                </div>
                <div className="delivery">
                  <div>
                    <span className="left-side">Vận chuyển: </span>
                    <span className="right-side">Miễn phí vận chuyển</span>
                  </div>
                </div>
                <div className="quantity">
                  <span className="left-side">Số lượng</span>
                  <span className="right-side">
                    <button>
                      <MinusOutlined
                        onClick={() => {
                          if (quantity > 1)
                            setQuantity((quantity) => quantity - 1);
                        }}
                      />
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      onChange={handleQuantityChange}
                    />
                    <button>
                      <PlusOutlined
                        onClick={() => {
                          if (quantity < dataBook.quantity)
                            setQuantity((quantity) => quantity + 1);
                        }}
                      />
                    </button>
                  </span>
                </div>

                <div className="btn" style={{ display: "flex", gap: "20px" }}>
                  <button
                    className="btn-left"
                    onClick={() => handleAddToCart(quantity, dataBook)}
                  >
                    <svg
                      enableBackground="new 0 0 15 15"
                      viewBox="0 0 15 15"
                      x="0"
                      y="0"
                      className="shopee-svg-icon tDviDD icon-add-to-cart"
                    >
                      <g>
                        <g>
                          <polyline
                            fill="none"
                            points=".5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeMiterlimit="10"
                          ></polyline>
                          <circle cx="6" cy="13.5" r="1" stroke="none"></circle>
                          <circle
                            cx="11.5"
                            cy="13.5"
                            r="1"
                            stroke="none"
                          ></circle>
                        </g>
                        <line
                          fill="none"
                          strokeLinecap="round"
                          strokeMiterlimit="10"
                          x1="7.5"
                          x2="10.5"
                          y1="7"
                          y2="7"
                        ></line>
                        <line
                          fill="none"
                          strokeLinecap="round"
                          strokeMiterlimit="10"
                          x1="9"
                          x2="9"
                          y1="8.5"
                          y2="5.5"
                        ></line>
                      </g>
                    </svg>

                    <span>Thêm Vào Giỏ Hàng</span>
                  </button>
                  <button className="btn-right" onClick={() => navigate('/order')}>Mua Ngay</button>
                </div>
              </Col>
            </Col>
          </Row>
        ) : (
          <BookLoader />
        )}
        {/* <BookLoader /> */}
      </div>

      <ModalGallery
        isShowModalGallery={isShowModalGallery}
        setIsShowModalGallery={setIsShowModalGallery}
        images={images}
        currentIndex={currentIndex}
        mainText={dataBook && dataBook.mainText}
      />
    </div>
  );
};

export default ViewDetail;
