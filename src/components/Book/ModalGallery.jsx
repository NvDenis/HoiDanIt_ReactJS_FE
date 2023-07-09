import { Col, Modal, Row, Image } from "antd";
import React, { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import ImageGallery from "react-image-gallery";

const ModalGallery = (props) => {
  const { isShowModalGallery, setIsShowModalGallery, images, currentIndex, mainText } =
    props;

  const refGallery = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  const handleTouchStart = (e) => {
    console.log("check e ", e);
  };

  return (
    <Modal
      width={"50vw"}
      open={isShowModalGallery}
      onCancel={() => setIsShowModalGallery(false)}
      footer={false}
      closeIcon={() => <></>}
    >
      <Row gutter={[20, 20]}>
        <Col span={16}>
          <ImageGallery
            items={images}
            ref={refGallery}
            startIndex={currentIndex}
            showPlayButton={false}
            showFullscreenButton={false}
            slideOnThumbnailOver={true}
            showThumbnails={false}
            slideDuration={0}
            onSlide={(i) => setActiveIndex(i)}
          />
        </Col>

        <Col span={8}>
          <div style={{paddingBottom: '10px'}}>{mainText}</div>
          <div>
            <Row gutter={[20, 20]}>
              {images.map((item, i) => {
                return (
                  <Col key={`image-${i}`}>
                    <div className={activeIndex === i ? "active" : ""}>
                      <Image
                        src={item.original}
                        width={100}
                        height={100}
                        preview={false}
                        onClick={() => {
                          refGallery.current.slideToIndex(i);
                          setActiveIndex(i);
                        }}
                      />
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalGallery;
