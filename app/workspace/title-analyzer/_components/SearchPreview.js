import React from "react";

const SearchPreview = () => {
  return (
    <div className="ha-search-preview max-w-5xl mx-auto  text-[14px] h-[480px] shadow-[0_60px_193px_rgba(24,39,75,0.1)] rounded-t-[21px] overflow-hidden cursor-default">
      {/* Browser Bar */}
      <div className="ha-search-preview__browser-bar h-[80px] bg-[#f3f4f5] mb-[60px] flex items-center px-4">
        <div className="browser-bar__dots mx-[2rem]">
          {/* Dot SVGs */}
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 83 19"
            className="h-[18px]"
          >
            <circle cx="9.502" cy="9.431" r="8.766" fill="#F83C5D" />
            <circle cx="41.646" cy="9.431" r="8.766" fill="#F18200" />
            <circle cx="73.79" cy="9.431" r="8.766" fill="#07C575" />
          </svg>
        </div>
        <div className="browser-bar__input text-[#70757a] w-full max-w-[800px] h-[44px] bg-white rounded-full flex items-center text-[18px] font-semibold px-6">
          www.google.com/image-search-results/
        </div>
      </div>

      {/* Header: Google Logo, Input Field, Settings */}
      <div className="ha-search-preview__header flex justify-around items-center flex-wrap px-4">
        {/* Google Logo */}
        <div className="ha-search-preview-logo w-[133px] mb-[1.5rem]">
          <svg
            width="107"
            height="35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#a)">
              <path
                d="m103.303 21.065 2.936 1.939c-.953 1.39-3.233 3.776-7.174 3.776-4.894 0-8.54-3.75-8.54-8.522 0-5.078 3.684-8.522 8.128-8.522 4.469 0 6.659 3.521 7.367 5.422l.387.97-11.515 4.72c.876 1.71 2.241 2.577 4.173 2.577s3.272-.944 4.238-2.36Zm-9.03-3.075 7.69-3.164c-.425-1.059-1.687-1.811-3.194-1.811-1.92 0-4.586 1.684-4.496 4.975Z"
                fill="#FF302F"
              ></path>
              <path
                d="M84.974 1.047h3.71v24.955h-3.71V1.047Z"
                fill="#20B15A"
              ></path>
              <path
                d="M79.126 10.4h3.58v15.156c0 6.29-3.748 8.88-8.179 8.88-4.173 0-6.685-2.781-7.625-5.04l3.284-1.352c.593 1.39 2.023 3.037 4.341 3.037 2.847 0 4.599-1.748 4.599-5.014v-1.225h-.13c-.85 1.02-2.472 1.94-4.533 1.94-4.302 0-8.244-3.713-8.244-8.497 0-4.81 3.942-8.56 8.244-8.56 2.048 0 3.684.905 4.534 1.9h.129V10.4Zm.257 7.885c0-3.011-2.022-5.206-4.598-5.206-2.602 0-4.792 2.195-4.792 5.206 0 2.972 2.19 5.128 4.792 5.128 2.576.013 4.598-2.156 4.598-5.128Z"
                fill="#3686F7"
              ></path>
              <path
                d="M45.855 18.22c0 4.912-3.864 8.523-8.604 8.523-4.74 0-8.604-3.624-8.604-8.523 0-4.937 3.864-8.535 8.604-8.535 4.74 0 8.604 3.598 8.604 8.535Zm-3.76 0c0-3.062-2.242-5.167-4.844-5.167-2.602 0-4.843 2.105-4.843 5.167 0 3.037 2.241 5.167 4.843 5.167s4.843-2.13 4.843-5.167Z"
                fill="#FF302F"
              ></path>
              <path
                d="M64.648 18.258c0 4.912-3.864 8.522-8.604 8.522-4.74 0-8.604-3.61-8.604-8.522 0-4.937 3.864-8.522 8.604-8.522 4.74 0 8.604 3.572 8.604 8.522Zm-3.773 0c0-3.062-2.242-5.167-4.844-5.167-2.602 0-4.843 2.105-4.843 5.167 0 3.036 2.241 5.167 4.843 5.167 2.615 0 4.843-2.143 4.843-5.167Z"
                fill="#FFBA40"
              ></path>
              <path
                d="M14.504 23.042c-5.397 0-9.622-4.313-9.622-9.658 0-5.346 4.225-9.658 9.622-9.658 2.91 0 5.036 1.136 6.607 2.59l2.59-2.564C21.51 1.672 18.586.09 14.503.09 7.11.09.889 6.061.889 13.384S7.11 26.678 14.504 26.678c3.993 0 7.007-1.302 9.364-3.726 2.421-2.398 3.168-5.766 3.168-8.496 0-.855-.103-1.736-.219-2.386H14.504v3.547h8.771c-.257 2.22-.966 3.738-2.009 4.771-1.262 1.263-3.259 2.654-6.762 2.654Z"
                fill="#3686F7"
              ></path>
            </g>
            <defs>
              <clipPath id="a">
                <path
                  fill="#fff"
                  transform="translate(.736 .038)"
                  d="M0 0h105.864v34.406H0z"
                />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Search Input Field */}
        <div className="ha-search-preview-input flex items-center w-[690px] max-w-full h-[44px] bg-white border border-transparent shadow-[0_2px_5px_1px_rgba(64,60,67,0.16)] rounded-[24px] px-5 mb-[1.5rem]">
          <div className="ha-search-preview-input__text flex-1 text-[16px] whitespace-pre font-bold text-[#5f6368] overflow-hidden">
            Types Of Coffee Drinks Explained: A Beginner’s Guide
          </div>
          <div className="ha-search-preview-input__icons flex gap-3 items-center">
            {/* Close icon */}
            <svg
              className="w-[16px] h-[16px]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.3 5.71a1 1 0 0 0-1.42 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4Z" />
            </svg>
            {/* Mic icon */}
            <svg
              className="w-[16px] h-[16px]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2Zm-4 7h-2v2h2v-2Z" />
            </svg>
            {/* Search icon */}
            <svg
              className="w-[16px] h-[16px]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 20.3 15.9 15c1.2-1.4 2-3.2 2-5.2C17.9 4.7 13.9.7 9 .7 4.1.7.1 4.7.1 9.8c0 5 4 9 8.9 9 2 0 3.8-.7 5.2-1.9l5.1 5c.2.2.5.3.7.3s.5-.1.7-.3c.3-.4.3-1 0-1.4ZM3 9.8C3 6.5 5.7 3.7 9 3.7s6 2.8 6 6.1c0 3.3-2.7 6-6 6-3.2 0-6-2.7-6-6Z" />
            </svg>
          </div>
        </div>

        {/* Settings Icon */}
        <div className="ha-search-preview-settings w-[133px] mb-[1.5rem] hidden sm:block">
          <svg
            className="w-[20px] h-[20px]"
            fill="none"
            stroke="#5f6368"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M10.325 4.317a8.958 8.958 0 0 1 3.35 0l.35 1.675a1.75 1.75 0 0 0 2.424 1.215l1.56-.65a8.963 8.963 0 0 1 1.7 2.7l-1.13 1.3a1.75 1.75 0 0 0 0 2.2l1.13 1.3a8.963 8.963 0 0 1-1.7 2.7l-1.56-.65a1.75 1.75 0 0 0-2.424 1.215l-.35 1.675a8.958 8.958 0 0 1-3.35 0l-.35-1.675a1.75 1.75 0 0 0-2.424-1.215l-1.56.65a8.963 8.963 0 0 1-1.7-2.7l1.13-1.3a1.75 1.75 0 0 0 0-2.2l-1.13-1.3a8.963 8.963 0 0 1 1.7-2.7l1.56.65a1.75 1.75 0 0 0 2.424-1.215l.35-1.675Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="ha-search-preview-tabs mb-[1.5rem] border-b border-[#ebebeb] px-4">
        <svg viewBox="0 0 652 40" className="w-full max-w-[652px] mx-auto">
          <circle cx="20" cy="20" r="4" fill="#1a73e8" />
          <circle cx="60" cy="20" r="4" fill="#dadce0" />
          <circle cx="100" cy="20" r="4" fill="#dadce0" />
          <circle cx="140" cy="20" r="4" fill="#dadce0" />
          <circle cx="180" cy="20" r="4" fill="#dadce0" />
          {/* Add more as needed */}
        </svg>
      </div>

      {/* Search Results */}
      <div className="ha-search-preview-results max-w-[652px] mx-auto px-4">
        <p className="ha-search-preview-results__stats text-[14px] text-[#70757a]">
          About 5,90,00,000 results (0.84 seconds)
        </p>
        <div className="ha-search-preview-url text-[#202124] mb-[5px]">
          https://wiedigital.com{" "}
          <span className="text-[#5f6368]">› headline-analyzer/</span>
        </div>
        <div className="ha-search-preview-results__phrase text-[#1a0dab] text-[20px] whitespace-nowrap overflow-hidden text-ellipsis max-w-[600px] mb-[10px]">
          Types Of Coffee Drinks Explained: A Beginner’s Guide
        </div>
        <div className="ha-search-preview-results__description text-[18px] text-[#4d5156] max-w-[600px]">
          Here is how your headline will look like in google search results
          page.
        </div>
      </div>
    </div>
  );
};

export default SearchPreview;
