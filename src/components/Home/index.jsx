import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Form,
  Checkbox,
  Divider,
  InputNumber,
  Button,
  Rate,
  Tabs,
  Pagination,
  Spin,
  Drawer,
} from "antd";
import "./home.scss";
import { callGetBookCategory, callGetListBook } from "../../services/api";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
const Home = () => {
  const [search, setSearch] = useOutletContext();

  const [form] = Form.useForm();
  const [category, setCategory] = useState([]);
  const [current, setCurrent] = useState(1);
  const [dataFilter, setDataFilter] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [listBook, setListBook] = useState([]);
  const [sortField, setSortField] = useState("&sort=-sold");
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [isShowSliderFilter, setIsShowSliderFilter] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getListBook();
  }, [current, sortField, dataFilter, search]);
  // get book
  const getListBook = async () => {
    setIsLoading(true);
    let query = "";
    query += `current=${current}&pageSize=${pageSize}`;

    if (sortField) {
      query += sortField;
    }

    if (dataFilter) {
      query += dataFilter;
    }

    if (search) {
      query += `&mainText=/${search}/i`;
    }

    let res = await callGetListBook(query);
    if (res?.data) {
      setListBook(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  //get category
  useEffect(() => {
    const getBookCategory = async () => {
      const res = await callGetBookCategory();
      // console.log("check res ", res);

      if (res && res?.data) {
        setCategory(res.data);
      }
    };
    getBookCategory();
  }, []);

  const handleChangeFilter = (changedValues, values) => {
    console.log(">>> check changedValuse", changedValues);
    console.log(">>> check values", values);

    if (changedValues.category) {
      const filter = changedValues.category;
      if (filter && filter.length > 0) {
        setDataFilter(`&category=${filter.join(",")}`);
      } else {
        setDataFilter("");
      }
    }
  };

  const onFinish = (values) => {
    console.log("check values", values);

    if (values?.range?.from > 0 && values?.range?.to > 0) {
      let range = `&price>=${values.range.from}&price<=${values.range.to}`;
      if (values?.category.length) {
        range += `&category=${values.category.join(",")}`;
      }
      setDataFilter(range);
    }
  };

  const onChange = (key) => {
    switch (key) {
      case "1":
        setSortField("&sort=-sold");
        break;
      case "2":
        setSortField("&sort=-CreateAt");
        break;
      case "3":
        setSortField("&sort=price");
        break;
      case "4":
        setSortField("&sort=-price");
        break;
      default:
        // Xử lý cho trường hợp không khớp
        break;
    }
  };

  const items = [
    {
      key: "1",
      label: `Phổ biến`,
      children: <></>,
    },
    {
      key: "2",
      label: `Hàng Mới`,
      children: <></>,
    },
    {
      key: "3",
      label: `Giá Thấp Đến Cao`,
      children: <></>,
    },
    {
      key: "4",
      label: `Giá Cao Đến Thấp`,
      children: <></>,
    },
  ];

  const handleOnchangePage = (pagination) => {
    console.log("check pagination ", pagination);
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }

    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  const convertToSlug = (book) => {
    return book
      .toLowerCase() // Chuyển thành chữ thường
      .normalize("NFD") // Chuẩn hóa chuỗi Unicode (bỏ dấu tiếng Việt)
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu thanh, dấu huyền, dấu sắc, dấu nặng
      .replace(/đ/g, "d") // Chuyển đổi "đ" thành "d"
      .replace(/[^a-z0-9 -]/g, "") // Xóa các ký tự không hợp lệ (chỉ giữ lại chữ cái, chữ số, khoảng trắng và dấu gạch ngang)
      .replace(/\s+/g, "-") // Thay thế khoảng trắng bằng dấu gạch ngang
      .replace(/-+/g, "-") // Loại bỏ các dấu gạch ngang liên tiếp
      .replace(/^-|-$/g, ""); // Loại bỏ dấu gạch ngang ở đầu và cuối chuỗi
  };

  const handleRedirectBook = (book) => {
    const slug = convertToSlug(book.mainText);
    navigate(`book/${slug}?id=${book._id}`);
  };

  return (
    <div style={{ backgroundColor: "#efefef", padding: "20px 0" }}>
      <div className="homepage-container">
        <Row
          gutter={[20, 20]}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Col
            md={4}
            sm={0}
            xs={0}
            style={{
              backgroundColor: "#fff",
              // marginTop: "20px",
              borderRadius: "8px",
            }}
          >
            <div style={{ padding: "20px", backgroundColor: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "medium" }}>
                  <FilterTwoTone /> Bộ lọc tìm kiếm
                </span>
                <ReloadOutlined
                  title="Reset"
                  onClick={() => {
                    form.resetFields();
                    setDataFilter("");
                  }}
                />
              </div>
              <Divider />
              <Form
                onFinish={onFinish}
                form={form}
                onValuesChange={(changedValues, values) =>
                  handleChangeFilter(changedValues, values)
                }
              >
                <Form.Item
                  name="category"
                  label="Danh mục sản phẩm"
                  labelCol={{ span: 24 }}
                >
                  <Checkbox.Group>
                    <Row>
                      {category &&
                        category.length > 0 &&
                        category.map((item) => {
                          return (
                            <Col
                              span={24}
                              key={item}
                              style={{ padding: "7px 0" }}
                            >
                              <Checkbox value={item}>{item}</Checkbox>
                            </Col>
                          );
                        })}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
                <Divider />
                <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 20,
                    }}
                  >
                    <Form.Item name={["range", "from"]}>
                      <InputNumber
                        name="from"
                        min={0}
                        placeholder="đ TỪ"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                    </Form.Item>
                    <span>-</span>
                    <Form.Item name={["range", "to"]}>
                      <InputNumber
                        name="to"
                        min={0}
                        placeholder="đ ĐẾN"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Button
                      onClick={() => form.submit()}
                      style={{ width: "100%" }}
                      type="primary"
                    >
                      Áp dụng
                    </Button>
                  </div>
                </Form.Item>
                <Divider />
                <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
                  <div>
                    <Rate
                      value={5}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text"></span>
                  </div>
                  <div>
                    <Rate
                      value={4}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text">trở lên</span>
                  </div>
                  <div>
                    <Rate
                      value={3}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text">trở lên</span>
                  </div>
                  <div>
                    <Rate
                      value={2}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text">trở lên</span>
                  </div>
                  <div>
                    <Rate
                      value={1}
                      disabled
                      style={{ color: "#ffce3d", fontSize: 15 }}
                    />
                    <span className="ant-rate-text">trở lên</span>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </Col>
          <Col
            md={19}
            xs={24}
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
            }}
          >
            <div style={{ padding: "20px", backgroundColor: "#fff" }}>
              <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
              <div className="filter" style={{ marginBottom: "10px" }}>
                <FilterTwoTone onClick={() => setIsShowSliderFilter(true)} />{" "}
                Lọc
              </div>
              <Spin tip="Loading..." spinning={isLoading}>
                <Row className="customize-row">
                  {listBook &&
                    listBook.length > 0 &&
                    listBook.map((item) => {
                      return (
                        <div
                          className="column"
                          key={item._id}
                          onClick={() => handleRedirectBook(item)}
                        >
                          <div className="wrapper">
                            <div className="thumbnail">
                              <img
                                src={`${
                                  import.meta.env.VITE_BACKEND_URL
                                }/images/book/${item?.thumbnail}`}
                                alt="thumbnail book"
                              />
                            </div>
                            <div className="text">{item.mainText}</div>
                            <div className="price">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(item.price)}
                            </div>
                            <div className="rating">
                              <Rate
                                value={5}
                                disabled
                                style={{ color: "#ffce3d", fontSize: 10 }}
                              />
                              <span>Đã bán {item.sold}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </Row>
              </Spin>

              <Divider />
              <div style={{ marginTop: "30px" }}></div>
              <Row style={{ display: "flex", justifyContent: "center" }}>
                <Pagination
                  defaultCurrent={1}
                  total={total}
                  responsive
                  current={current}
                  pageSize={pageSize}
                  onChange={(p, s) =>
                    handleOnchangePage({ current: p, pageSize: s })
                  }
                />
              </Row>
            </div>
          </Col>
        </Row>
      </div>

      <Drawer
        title="Lọc sản phẩm"
        placement="right"
        onClose={() => setIsShowSliderFilter(false)}
        open={isShowSliderFilter}
      >
        <div style={{ padding: "20px", backgroundColor: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: "medium" }}>
              <FilterTwoTone /> Bộ lọc tìm kiếm
            </span>
            <ReloadOutlined
              title="Reset"
              onClick={() => {
                form.resetFields();
                setDataFilter("");
              }}
            />
          </div>
          <Divider />
          <Form
            onFinish={onFinish}
            form={form}
            onValuesChange={(changedValues, values) =>
              handleChangeFilter(changedValues, values)
            }
          >
            <Form.Item
              name="category"
              label="Danh mục sản phẩm"
              labelCol={{ span: 24 }}
            >
              <Checkbox.Group>
                <Row>
                  {category &&
                    category.length > 0 &&
                    category.map((item) => {
                      return (
                        <Col span={24} key={item} style={{ padding: "7px 0" }}>
                          <Checkbox value={item}>{item}</Checkbox>
                        </Col>
                      );
                    })}
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Divider />
            <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <Form.Item name={["range", "from"]}>
                  <InputNumber
                    name="from"
                    min={0}
                    placeholder="đ TỪ"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
                <span>-</span>
                <Form.Item name={["range", "to"]}>
                  <InputNumber
                    name="to"
                    min={0}
                    placeholder="đ ĐẾN"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
              </div>
              <div>
                <Button
                  onClick={() => form.submit()}
                  style={{ width: "100%" }}
                  type="primary"
                >
                  Áp dụng
                </Button>
              </div>
            </Form.Item>
            <Divider />
            <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
              <div>
                <Rate
                  value={5}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text"></span>
              </div>
              <div>
                <Rate
                  value={4}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text">trở lên</span>
              </div>
              <div>
                <Rate
                  value={3}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text">trở lên</span>
              </div>
              <div>
                <Rate
                  value={2}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text">trở lên</span>
              </div>
              <div>
                <Rate
                  value={1}
                  disabled
                  style={{ color: "#ffce3d", fontSize: 15 }}
                />
                <span className="ant-rate-text">trở lên</span>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Drawer>
    </div>
  );
};

export default Home;
