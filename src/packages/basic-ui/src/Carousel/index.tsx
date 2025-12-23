import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRef } from "react";
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

export interface CarouselProps {
  children: React.ReactNode[];
  settings?: Omit<Partial<Settings>, "arrows">;
  arrowsPosition?: {
    prev: ArrowPosition;
    next: ArrowPosition;
  };
  LeftArrow?: React.ReactNode;
  RightArrow?: React.ReactNode;
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
  onClick,
  children,
  arrowPosition,
  ...props
}: {
  onClick: () => void;
  children: React.ReactNode;
  arrowPosition: ArrowPosition;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      onClick={onClick}
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
  containerClassName,
}: CarouselProps) {
  const sliderRef = useRef<Slider>(null);

  const mergedContainerClassName = twMerge(
    "relative w-full",
    containerClassName
  );

  const mergedSettings: Settings = {
    ...defaultSettings,
    ...settings,
    arrows: false,
  };

  return (
    <div className={mergedContainerClassName}>
      {arrowsPosition?.prev && (
        <NavButton
          onClick={() => sliderRef.current?.slickPrev()}
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
          onClick={() => sliderRef.current?.slickNext()}
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
    </div>
  );
}
