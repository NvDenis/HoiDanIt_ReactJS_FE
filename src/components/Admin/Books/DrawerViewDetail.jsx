import { PlusOutlined } from "@ant-design/icons";
import { Badge, Descriptions, Divider, Drawer, Modal, Upload } from "antd";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const DrawerViewDetail = (props) => {
  const { isShowDrawerDetail, setIsShowDrawerDetail, dataDetail } = props;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState();

  useEffect(() => {
    if (dataDetail) {
      let imgThumbnail = {},
        imgSlider = [];
      if (dataDetail.thumbnail) {
        imgThumbnail = {
          uid: uuidv4(),
          name: dataDetail.mainText,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataDetail.thumbnail
          }`,
        };
      }
      if (dataDetail.slider && dataDetail.slider.length > 0) {
        dataDetail.slider.map((item) => {
          imgSlider.push({
            uid: uuidv4(),
            name: dataDetail.mainText,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          });
        });
      }
      setFileList([imgThumbnail, ...imgSlider]);
    }
  }, [dataDetail]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  // const uploadButton = (
  //   <div>
  //     <PlusOutlined />
  //     <div style={{ marginTop: 8 }}>Upload</div>
  //   </div>
  // );

  return (
    <>
      <Drawer
        title="Chức năng xem chi tiết"
        width={"50vw"}
        open={isShowDrawerDetail}
        onClose={() => setIsShowDrawerDetail(false)}
      >
        <Descriptions title="Thông tin sách" bordered column={2}>
          <Descriptions.Item label="ID">{dataDetail._id}</Descriptions.Item>
          <Descriptions.Item label="Tên sách">
            {dataDetail.mainText}
          </Descriptions.Item>
          <Descriptions.Item label="Tác giả">
            {dataDetail.author}
          </Descriptions.Item>
          <Descriptions.Item label="Giá tiền">
            {dataDetail.price}
          </Descriptions.Item>
          <Descriptions.Item label="Thể loại" span={2}>
            <Badge status="processing" text={dataDetail.category} />
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {dataDetail.createdAt}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">
            {dataDetail.updatedAt}
          </Descriptions.Item>
        </Descriptions>
        <Divider orientation="left">Ảnh sách</Divider>

        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={{
            showRemoveIcon: false,
          }}
        ></Upload>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Drawer>
    </>
  );
};

export default DrawerViewDetail;
