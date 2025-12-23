import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRef, useState } from "react";
import Slider, { type Settings } from "react-slick";
import ChevronLeftIcon from "@icons/icon_byuckicon_chevron_left.svg?react";
import ChevronRightIcon from "@icons/icon_byuckicon_chevron_right.svg?react";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

interface ArrowPosition {
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
  transform?: string;
}

type DotsPosition =
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "top-left"
  | "top-right";

interface CarouselProps {
  children: React.ReactNode[];
  settings?: Omit<Partial<Settings>, "arrows" | "dots">;
  arrowsPosition?: {
    prev: ArrowPosition;
    next: ArrowPosition;
  };
  LeftArrow?: React.ReactNode;
  RightArrow?: React.ReactNode;
  dotsPosition?: DotsPosition;
  containerClassName?: string;
}

const defaultSettings: Settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const NavButton = ({
  children,
  arrowPosition,
  ...props
}: {
  children: React.ReactNode;
  arrowPosition: ArrowPosition;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      style={{
        position: "absolute",
        cursor: "pointer",
        ...arrowPosition,
        zIndex: 1,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default function Carousel({
  children,
  settings = {},
  arrowsPosition,
  LeftArrow,
  RightArrow,
  dotsPosition,
  containerClassName,
}: CarouselProps) {
  const sliderRef = useRef<Slider>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const mergedContainerClassName = twMerge(
    "relative w-full",
    containerClassName
  );

  const mergedDotsPosition = twMerge(
    "absolute flex gap-2 w-content justify-center",
    dotsPosition === "bottom-center" && "bottom-2 left-1/2 -translate-x-1/2",
    dotsPosition === "bottom-left" && "bottom-2 left-2",
    dotsPosition === "bottom-right" && "bottom-2 right-2",
    dotsPosition === "top-center" && "top-2 left-1/2 -translate-x-1/2",
    dotsPosition === "top-left" && "top-2 left-2",
    dotsPosition === "top-right" && "top-2 right-2"
  );

  const mergedSettings: Settings = {
    ...defaultSettings,
    ...settings,
    arrows: false,
    dots: false,
    afterChange: (index) => {
      setCurrentIndex(index);
    },
  };

  const nexNavHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    sliderRef.current?.slickNext();
  };

  const prevNavHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    sliderRef.current?.slickPrev();
  };

  const dotsNavHandler =
    (index: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      sliderRef.current?.slickGoTo(index);
    };

  return (
    <div className={mergedContainerClassName}>
      {arrowsPosition?.prev && (
        <NavButton
          onClick={prevNavHandler}
          arrowPosition={arrowsPosition?.prev}
          aria-label="이전 슬라이드"
          type="button"
        >
          {LeftArrow ?? (
            <div className="size-[40px] flex items-center justify-center bg-[#00000040] rounded-full">
              <ChevronLeftIcon />
            </div>
          )}
        </NavButton>
      )}
      <Slider ref={sliderRef} {...mergedSettings}>
        {children.map((child) => (
          <div key={uuidv4()}>{child}</div>
        ))}
      </Slider>
      {arrowsPosition?.next && (
        <NavButton
          onClick={nexNavHandler}
          arrowPosition={arrowsPosition?.next}
          aria-label="다음 슬라이드"
          type="button"
        >
          {RightArrow ?? (
            <div className="size-[40px] flex items-center justify-center bg-[#00000040] rounded-full">
              <ChevronRightIcon />
            </div>
          )}
        </NavButton>
      )}
      {dotsPosition && (
        <ul className={mergedDotsPosition}>
          {Array.from({ length: children.length }).map((_, index) => (
            <li key={uuidv4()}>
              <button
                type="button"
                className="p-[5px] cursor-pointer"
                onClick={dotsNavHandler(index)}
              >
                <div
                  className={`w-[5px] h-[5px] rounded-full ${
                    currentIndex === index ? "bg-[#000000BF]" : "bg-[#00000040]"
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
