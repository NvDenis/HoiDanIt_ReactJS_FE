import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
  message,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  callCreateBook,
  callGetBookCategory,
  callUpdateBook,
  callUploadBookImg,
} from "../../../services/api";
import { v4 as uuidv4 } from "uuid";

const BookUpdate = (props) => {
  const { isShowModalUpdate, setIsShowModalUpdate, getListBook, dataEdit } =
    props;

  const [loadingThumbnail, setLoadingThumbnail] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [listCategory, setListCategory] = useState([]);
  const [dataThumbnail, setDataThumbnail] = useState([]);
  const [dataSlider, setDataSlider] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [form] = Form.useForm();
  const [initForm, setInitForm] = useState();

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleChange = async (info, type) => {
    if (info.file.status === "uploading") {
      type ? setLoadingSlider(true) : setLoadingThumbnail(true);
      return;
    }
    if (info.file.status === "done") {
      type ? setLoadingSlider(false) : setLoadingThumbnail(false);
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.substring(file.lastIndexOf("/") + 1));
  };

  useEffect(() => {
    const getBookCategory = async () => {
      let res = await callGetBookCategory();
      if (res?.data) {
        const data = res.data.map((item) => {
          return { value: item, label: item };
        });
        setListCategory(data);
      }
    };
    getBookCategory();
  }, []);

  const handleUploadSlider = async ({ file, onSuccess, onError }) => {
    let res = await callUploadBookImg(file);
    if (res?.data) {
      onSuccess("ok");
      setDataSlider((dataSlider) => [
        ...dataSlider,
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
    } else {
      onError(res.message);
    }
  };

  const handleUploadThumbnail = async ({ file, onSuccess, onError }) => {
    let res = await callUploadBookImg(file);
    if (res?.data) {
      onSuccess("ok");
      setDataThumbnail([
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
    } else {
      onError(res.message);
    }
  };

  const handleUploadRemove = (file, type) => {
    if (type === "thumbnail") {
      setDataThumbnail([]);
    }
    if (type === "slider") {
      let data = dataSlider.filter((item) => item.uid !== file.uid);
      setDataSlider(data);
    }
  };
  const onFinish = async (values) => {
    const { _id, author, mainText, price, category, quantity, sold } = values;
    if (dataThumbnail.length === 0) {
      notification.error({
        message: "An error",
        description: "Please upload thumbnail picture!",
      });
      return;
    }
    if (dataSlider.length === 0) {
      notification.error({
        message: "An error",
        description: "Please upload slider picture!",
      });
      return;
    }

    const thumbnail = dataThumbnail[0].name;
    const slider = dataSlider.map((item) => item.name);

    let res = await callUpdateBook(
      _id,
      mainText,
      thumbnail,
      slider,
      author,
      price,
      quantity,
      category,
      sold
    );
    if (res?.data) {
      message.success("The book was updated successfully!");
      setIsShowModalUpdate(false);
      form.resetFields();
      setDataSlider([]);
      setDataThumbnail([]);
      getListBook();
    } else {
      notification.error({
        message: "An error occurred",
        description: res.message,
      });
    }
  };

  useEffect(() => {
    if (dataEdit?._id) {
      const thumbnail = [
        {
          uid: uuidv4(),
          name: dataEdit.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataEdit.thumbnail
          }`,
        },
      ];

      const slider = dataEdit?.slider?.map((item) => {
        return {
          uid: uuidv4(),
          name: item,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
        };
      });

      const init = {
        _id: dataEdit._id,
        mainText: dataEdit.mainText,
        author: dataEdit.author,
        price: dataEdit.price,
        category: dataEdit.category,
        quantity: dataEdit.quantity,
        sold: dataEdit.sold,
        thumbnail: { fileList: thumbnail },
        slider: { fileList: slider },
      };

      setInitForm(init);
      setDataThumbnail(thumbnail);
      setDataSlider(slider);
      form.setFieldsValue(init);
    }
  }, [dataEdit]);
  return (
    <>
      <Modal
        title="Edit book"
        destroyOnClose={true}
        open={isShowModalUpdate}
        width={"50vw"}
        onCancel={() => {
          setIsShowModalUpdate(false);
          form.resetFields();
          setDataThumbnail([]);
          setDataSlider([]);
        }}
        okText="Confirm"
        onOk={() => form.submit()}
      >
        <Divider />
        <Form form={form} onFinish={onFinish} autoComplete="off">
          <Row gutter={[16, 16]}>
            <Form.Item
              name="_id"
              label="Book's name"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "Please input book's name!" }]}
              hidden
            >
              <Input />
            </Form.Item>
            <Col span={12}>
              <Form.Item
                name="mainText"
                label="Book's name"
                labelCol={{ span: 24 }}
                rules={[
                  { required: true, message: "Please input book's name!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="author"
                label="Author"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: "Please input author!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Form.Item
                name="price"
                label={"Price"}
                labelCol={{ span: "24" }}
                rules={[{ required: true, message: "Please input price!" }]}
              >
                <InputNumber min={0} addonAfter={"VND"} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="category"
                label={"Category"}
                labelCol={{ span: "24" }}
                rules={[{ required: true, message: "Please input category!" }]}
              >
                <Select
                  style={{ width: "100%" }}
                  // onChange={handleChange}
                  options={listCategory}
                  showSearch
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="quantity"
                label={"Quantity"}
                labelCol={{ span: "24" }}
                rules={[{ required: true, message: "Please input quantity!" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="sold"
                label={"Sold"}
                labelCol={{ span: "24" }}
                rules={[{ required: true, message: "Please input sold!" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                label="Thumbnail picture"
                labelCol={{ span: 24 }}
                name="thumbnail"
                valuePropName="thumbnail"
              >
                <Upload
                  name="thumbnail"
                  listType="picture-card"
                  className="avatar-uploader"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  showUploadList={true}
                  customRequest={handleUploadThumbnail}
                  onPreview={handlePreview}
                  onRemove={(file) => handleUploadRemove(file, "thumbnail")}
                  maxCount={1}
                  multiple={false}
                  defaultFileList={initForm?.thumbnail?.fileList ?? []}
                >
                  <div>
                    {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Slider picture"
                labelCol={{ span: 24 }}
                valuePropName="slider"
                name="slider"
              >
                <Upload
                  name="slider"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={true}
                  beforeUpload={beforeUpload}
                  onPreview={handlePreview}
                  onChange={(info) => handleChange(info, "slider")}
                  multiple
                  customRequest={handleUploadSlider}
                  onRemove={(file) => handleUploadRemove(file, "slider")}
                  defaultFileList={initForm?.slider?.fileList ?? []}
                >
                  <div>
                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={() => setPreviewOpen(false)}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Modal>
    </>
  );
};

export default BookUpdate;
