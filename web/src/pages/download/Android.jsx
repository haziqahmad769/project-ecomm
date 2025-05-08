import React from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdAddToHomeScreen } from "react-icons/md";

const Android = () => {
  return (
    <div className=" flex flex-col items-center p-4">
      <div className=" flex flex-col my-4">
        <div className=" flex flex-col rounded-md card bg-white shadow-lg p-4 max-w-72">
          <h2 className=" text-gray-700 text-lg font-semibold mb-2">
            For Android
          </h2>
          {/* instruction */}
          <div className="">
            <p className="text-gray-600 text-md font-semibold">
              At Chrome app on your phone:
            </p>
            <ol className="list-decimal px-6 py-2 text-gray-600">
              <li className="mb-2">
                <p className="flex flex-row items-center">
                  Tap{" "}
                  <HiOutlineDotsVertical className="mx-1 text-rose-500 text-lg" />{" "}
                  in the browser
                </p>
              </li>
              <li className="mb-2">
                <div className="flex flex-row flex-wrap">
                  <p>Scroll down the list of options, then tap </p>
                  <p className="flex flex-row items-center text-rose-500">
                    <MdAddToHomeScreen className="mr-1" /> Add to Home Screen
                  </p>
                </div>
              </li>
              <li>
                <div className="flex flex-row">
                  <p>Click</p>
                  <p className="mx-1 text-rose-500">Add/ Install</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Android;
