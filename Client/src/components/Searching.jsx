import React, { useEffect, useState } from 'react';
import { Input } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { ApiHandler } from "../utils/ApiHandler.js";
import { CircularProgress } from "@nextui-org/react";
import UserComponent from './UserComponent';

function Searching() {
  const [value, setValue, loading, error, response] = ApiHandler(`${import.meta.env.VITE_API_URL_HEADER}/SearchFriends/searchUsers?query=`, "get");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (response?.data?.data) {
      setUsers(response.data.data);
    } else {
      setUsers([]);
    }
  }, [response]);

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='w-9/12 h-full  flex flex-col'>
        <div className='p-3'>
          <Input
            label="Search"
            isClearable
            radius="lg"
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "shadow-xl",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focus=true]:bg-default-200/50",
                "dark:group-data-[focus=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            placeholder="Type to search..."
            startContent={
              <FaSearch className='text-white cursor-pointer text-lg hover:text-xl hover:text-gray-200' />
            }
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className='w-full h-full  flex-grow flex flex-col items-center pt-3 pb-3 gap-3'>
          {loading && <CircularProgress size="lg" aria-label="Loading..." />}
          {error && (<p className='text-red-500 font-semibold'>Error occurred: {error}</p>)}
          {
            users.length === 0 ? (
              !loading && !error && (<h2>No users found</h2>)
            ) : (
              users.map((user, index) => (
                <UserComponent avatar={user.dp} userName={user.userName} key={index}  _id={user._id}/>
              ))
            )
          }
        </div>
      </div>
    </div>
  );
}

export default Searching;
