import React from "react";
import { RxShare2 } from "react-icons/rx";
import { CgAddR } from "react-icons/cg";

const Apple = () => {
  return (
    <div className=" flex flex-col items-center p-4">
      <div className=" flex flex-col my-4">
        <div className=" flex flex-col rounded-md card bg-white shadow-lg p-4 max-w-72">
          <h2 className=" text-gray-700 text-lg font-semibold mb-2">
            For iPhone
          </h2>
          {/* instruction */}
          <div className="">
            <p className="text-gray-600 text-md font-semibold">
              At Safari app on your iPhone:
            </p>
            <ol className="list-decimal px-6 py-2 text-gray-600">
              <li className="mb-2">
                <p className="flex flex-row items-center">
                  Tap <RxShare2 className="mx-1 text-rose-500 text-lg" /> on
                  menu bar
                </p>
              </li>
              <li className="mb-2">
                <div className="flex flex-row flex-wrap">
                  <p>Scroll down the list of options, then tap </p>
                  <p className="flex flex-row items-center text-rose-500">
                    Add to Home Screen <CgAddR className="ml-1" />
                  </p>
                </div>
              </li>
              <li>
                <div className="flex flex-row">
                  <p>Click</p>
                  <p className="mx-1 text-rose-500">Add</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apple;
