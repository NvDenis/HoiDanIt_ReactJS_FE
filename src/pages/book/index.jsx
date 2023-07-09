import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { callFecthDetailBookById } from "../../services/api";
import ViewDetail from "../../components/Book/ViewDetail";

const index = (props) => {
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const [dataBook, setDataBook] = useState();

  let id = params.get("id");

  useEffect(() => {
    fetchBookId(id);
  }, [id]);

  const fetchBookId = async (id) => {
    let res = await callFecthDetailBookById(id);

    if (res && res.data) {
      res.data.images = getImages(res.data);

      setTimeout(() => {
        setDataBook(res.data);
      }, 1000);
    }
  };

  const getImages = (data) => {
    let images = [];

    images.push({
      original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
        data.thumbnail
      }`,
      thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
        data.thumbnail
      }`,
    });

    data.slider.map((item) => {
      return images.push({
        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
      });
    });

    return images;
  };

  return (
    <>
      <ViewDetail dataBook={dataBook} />
    </>
  );
};

export default index;
