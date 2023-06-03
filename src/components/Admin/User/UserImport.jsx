import { Modal, message, Upload, Table } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useState } from "react";

const { Dragger } = Upload;
const UserImport = (props) => {
  const { isModalImportOpen, setIsModalImportOpen } = props;
  const [dataImport, setDataImport] = useState("");

  const dummyRequest = async ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 2000);
  };

  const UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    customRequest: dummyRequest,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);

        let reader = new FileReader();

        reader.onload = function (e) {
          let data = new Uint8Array(e.target.result);
          let workbook = XLSX.read(data, { type: "array" });
          // find the name of your sheet in the workbook first
          let worksheet = workbook.Sheets["Sheet1"];

          // convert to json format
          let jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: ["fullName", "email", "phone"],
            range: 1,
          });

          jsonData = jsonData.map((item, index) => ({
            ...item,
            key: index.toString(), // Thêm thuộc tính key với giá trị duy nhất
          }));
          if (jsonData) setDataImport(jsonData);
        };
        reader.readAsArrayBuffer(info.file.originFileObj);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <>
      <Modal
        title="Import data user"
        open={isModalImportOpen}
        onOk={() => setIsModalImportOpen(false)}
        onCancel={() => setIsModalImportOpen(false)}
        okText={"Import data"}
        width={"50vw"}
        maskClosable={false}
        okButtonProps={{
          disabled: true,
        }}
      >
        <Dragger {...UploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single upload. Only accept .csv .xls .xlsx.
          </p>
        </Dragger>

        <div style={{ padding: "20px 0" }}>
          <Table
            title={() => <span>Dữ liệu upload</span>}
            columns={[
              {
                title: "Tên hiển thị",
                dataIndex: "fullName",
              },
              {
                title: "Email",
                dataIndex: "email",
              },
              {
                title: "Số điện thoại",
                dataIndex: "phone",
              },
            ]}
            dataSource={dataImport}
          />
        </div>
      </Modal>
    </>
  );
};

export default UserImport;
