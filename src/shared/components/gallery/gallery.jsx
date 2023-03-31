import { Icon } from "lib-frontsga";
import React, { useState, useEffect, useRef } from "react";

import GalleryPreview from "shared/components/gallery-preview";
import IconThumbnail from "../IconThumbnail";
import FullImage from "./components/full-image";

import { debounce } from "../../../utils";

import "./styles.css";

function Gallery(props) {
  const { className, items, visible, onClose, initialActive } = props;

  const [activeSlideIndex, setActiveSlideIndex] = useState(initialActive);
  const [visiblePrevBtn, setvisiblePrevBtn] = useState(true);
  const [visibleNextBtn, setvisibleNextBtn] = useState(true);

  const footerRef = useRef(null);
  const carrouselRef = useRef(null);
  const activeLiRef = useRef(null);

  useEffect(() => {
    if (footerRef.current && carrouselRef.current) {
      if (footerRef.current.clientWidth - 30 > carrouselRef.current.clientWidth) {
        setvisiblePrevBtn(false);
        setvisibleNextBtn(false);
      } else {
        if (activeSlideIndex === items.length - 1) {
          setvisibleNextBtn(false);
        } else if (activeSlideIndex === 0) {
          setvisiblePrevBtn(false);
        } else {
          setvisiblePrevBtn(true);
          setvisibleNextBtn(true);
        }

        centerActiveLi();
      }
    }
  }, [visible, activeSlideIndex]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  });

  const handleNext = () => {
    if (activeSlideIndex < items.length - 1) {
      setActiveSlideIndex(activeSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
  };

  const handleKeyPress = debounce((event) => {
    var handled = false;

    //ARROW RIGHT
    if (event.keyCode == 39) {
      handleNext();
      handled = true;
    }

    //ARROW LEFT
    if (event.keyCode == 37) {
      handlePrev();
      handled = true;
    }

    //ESC
    if (event.keyCode == 27) {
      onClose();
      handled = true;
    }

    if (handled) {
      event.preventDefault();
    }
  }, 100);

  const centerActiveLi = () => {
    const scrollIntoViewOptions = {
      behavior: "smooth", //transition type
      inline: "center", //horizontal alignement
    };
    activeLiRef.current.scrollIntoView(scrollIntoViewOptions);
  };

  return (
    <div className={`gallery ${className || ""}`}>
      {visible ? (
        <div className="full-window-gallery">
          <section className="current-image">
            <Icon
              className="close-btn"
              icon="sga-icon-times"
              iconColor="#E6E6E6"
              onClick={() => {
                setActiveSlideIndex(0);
                onClose();
              }}
            />
            <FullImage
              type={items[activeSlideIndex].format}
              url={items[activeSlideIndex].image}
              alt={items[activeSlideIndex].title}
            />
            {items[activeSlideIndex].caption}
          </section>
          <footer ref={footerRef}>
            {visiblePrevBtn ? (
              <Icon icon="sga-icon-angle-left" className="carrousel-btn prev" onClick={handlePrev} />
            ) : null}
            {visibleNextBtn ? (
              <Icon icon="sga-icon-angle-right" className="carrousel-btn next" onClick={handleNext} />
            ) : null}

            <ul ref={carrouselRef}>
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className={index === activeSlideIndex ? "active" : ""}
                  onClick={() => setActiveSlideIndex(index)}
                  ref={index === activeSlideIndex ? activeLiRef : null}
                >
                  <IconThumbnail type={item.format} url={item.thumbnail} alt={item.documentName} />
                  {index === activeSlideIndex ? (
                    <Icon className="eye-gallery" icon="sga-icon-eye" iconColor="link" size="size-m" />
                  ) : null}
                </li>
              ))}
            </ul>
          </footer>
        </div>
      ) : null}
    </div>
  );
}

export default Gallery;
