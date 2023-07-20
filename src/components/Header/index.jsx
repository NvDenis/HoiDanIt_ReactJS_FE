import React, { useEffect, useState } from "react";
import { FaReact } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";
import { Divider, Badge, Drawer, message, Avatar, Popover } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useNavigate } from "react-router";
import { callLogout } from "../../services/api";
import "./header.scss";
import { doLogoutAction } from "../../redux/account/accountSlice";
import { Link } from "react-router-dom";
import UserInfo from "../ModalManageAccount/UserInfo";
import ManageAccount from "../ModalManageAccount/ManageAccount";
import { doResetCartsAction } from "../../redux/order/orderSlice";

const Header = (props) => {
  const { search, setSearch } = props;
  const [openDrawer, setOpenDrawer] = useState(false);
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartsQuantity = useSelector((state) => state.order.carts.length);
  const carts = useSelector((state) => state.order.carts);
  const [isShowModalManageAccount, setIsShowModalManageAccount] =
    useState(false);

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      dispatch(doResetCartsAction());
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  };

  let items = [
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          Trang chủ
        </label>
      ),
      key: "trang chủ",
    },
    {
      label: (
        <label
          style={{ cursor: "pointer" }}
          onClick={() => setIsShowModalManageAccount(true)}
        >
          Quản lý tài khoản
        </label>
      ),
      key: "account",
    },
    {
      label: (
        <label
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/history")}
        >
          Lịch sử mua hàng
        </label>
      ),
      key: "history",
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];

  if (user?.role == "ADMIN") {
    items.unshift({
      label: <Link to="/admin">Trang quản trị</Link>,
      key: "admin",
    });
  }

  const urlAvater = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;

  const renderContent = () => {
    return (
      <div className="popover-list">
        {carts &&
          carts.map((item) => {
            return (
              <div className="popover-item" key={`item-${item._id}`}>
                <div className="popover-left">
                  <div className="popover-img">
                    <img
                      className="img"
                      src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                        item.detail.thumbnail
                      }`}
                      alt=""
                    />
                  </div>
                  <p className="popover-maintext">{item.detail.mainText}</p>
                </div>

                <p className="popover-price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.detail.price)}
                </p>
              </div>
            );
          })}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div></div>
          <button className="btnPreviewCarts" onClick={() => navigate("order")}>
            Xem giỏ hàng
          </button>
        </div>
      </div>
    );
  };

  const handleWindowResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isShowPopover, setIsShowPopover] = useState(true);
  const handlePopoverClick = () => {
    if (windowWidth > 1060) {
      // Nếu kích thước màn hình lớn hơn 1060px, hiển thị Popover
      // Do bạn sử dụng trigger={"click"}, Popover sẽ tự động hiện ra khi người dùng click vào Icon Cart
    } else {
      setIsShowPopover(false);
      navigate("order");
    }
  };

  return (
    <>
      <div className="header-container">
        <header className="page-header">
          <div className="page-header__top">
            <div
              className="page-header__toggle"
              onClick={() => {
                setOpenDrawer(true);
              }}
            >
              ☰
            </div>
            <div className="page-header__logo">
              <span className="logo" onClick={() => navigate("/")}>
                <FaReact className="rotate icon-react" /> Hỏi Dân IT
                <VscSearchFuzzy className="icon-search" />
              </span>
              <input
                className="input-search"
                type={"text"}
                placeholder="Bạn tìm gì hôm nay"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <nav className="page-header__bottom">
            <ul id="navigation" className="navigation">
              <li className="navigation__item">
                {cartsQuantity > 0 ? (
                  windowWidth > 1060 ? (
                    <Popover
                      title={"Sản phẩm mới thêm"}
                      content={renderContent}
                      placement="bottomRight"
                      trigger={"hover"}
                      onClick={handlePopoverClick}
                    >
                      <Badge count={cartsQuantity} showZero size={"small"}>
                        <FiShoppingCart className="icon-cart" />
                      </Badge>
                    </Popover>
                  ) : (
                    <Badge
                      count={cartsQuantity}
                      showZero
                      size={"small"}
                      onClick={() => navigate("order")}
                    >
                      <FiShoppingCart className="icon-cart" />
                    </Badge>
                  )
                ) : (
                  <Badge
                    count={cartsQuantity}
                    showZero
                    size={"small"}
                    onClick={() => navigate("/")}
                  >
                    <FiShoppingCart className="icon-cart" />
                  </Badge>
                )}
              </li>

              <li className="navigation__item">
                {!isAuthenticated ? (
                  <Avatar
                    onClick={() => navigate("/login")}
                    size={32}
                    icon={<UserOutlined />}
                  />
                ) : (
                  <Dropdown menu={{ items }} trigger={["click"]}>
                    <Space className="account">
                      <Avatar src={urlAvater} />
                      <span className="name-account">{user?.fullName}</span>
                    </Space>
                  </Dropdown>
                )}
              </li>
            </ul>
          </nav>
        </header>
      </div>
      <Drawer
        title="Menu chức năng"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        {isAuthenticated && (
          <div>
            {user?.role === "ADMIN" && (
              <>
                <span onClick={() => navigate("/admin")}>Trang quản trị</span>
                <Divider />
              </>
            )}
            <label
              style={{ cursor: "pointer" }}
              onClick={() => setIsShowModalManageAccount(true)}
            >
              Quản lý tài khoản
            </label>
            <Divider />
            <label
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/history")}
            >
              Lịch sử mua hàng
            </label>
            <Divider />
            <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
              Đăng xuất
            </label>
          </div>
        )}
      </Drawer>

      <ManageAccount
        isShowModalManageAccount={isShowModalManageAccount}
        setIsShowModalManageAccount={setIsShowModalManageAccount}
      />
    </>
  );
};

export default Header;
