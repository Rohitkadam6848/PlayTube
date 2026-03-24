import React, { useState } from "react";
import logo from "../assets/playtube1.png";

import {
  FaBars,
  FaUserCircle,
  FaHome,
  FaHistory,
  FaList,
  FaThumbsUp,
  FaSearch,
  FaMicrophone,
  FaTimes,
} from "react-icons/fa";

import { IoIosAddCircle } from "react-icons/io";
import { GoVideo } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Profile from "../components/profile";
import AllVideosPage from "../components/AllVideosPage";
import AllShortsPage from "../components/AllShortsPage";

function Home() {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Home");
  const [active, setActive] = useState("Home");
  const [popup, setPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useSelector((state) => state.user);

  const categories = [
    "Music",
    "Gaming",
    "TV Shows",
    "News",
    "Trending",
    "Entertainment",
    "Education",
    "Science & Tech",
    "Travel",
    "Fashion",
    "Cooking",
    "Sports",
    "Pets",
    "Art",
    "Comedy",
    "Vlogs",
  ];
  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen relative">
      {/* navbar */}
      <header className="bg-[#0f0f0f] h-15 p-3 border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between ">
          {/* left */}
          <div className="flex items-center gap-4">
            <button
              className="text-xl bg-[#272727] p-2 rounded-full md:inline hidden"
              onClick={() => setSideBarOpen(!sideBarOpen)}
            >
              <FaBars />
            </button>
            <div className="flex items-center gap-1.25">
              <img src={logo} className="w-7.5"></img>
              <span className="text-white font-bold text-xl tracking-tight font-roboto">
                PlayTube
              </span>
            </div>
          </div>

          {/* search */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl">
            <div className="flex flex-1">
              <input
                className="flex-1 bg-[#121212] px-4 py-2 rounded-l-full outline-none border border-gray-700 "
                placeholder="Search"
              ></input>
              <button className="bg-[#272727] px-4 rounded-r-full broder-gray-700">
                <FaSearch />
              </button>
            </div>
            <button className="bg-[#272727] p-3 rounded-full">
              <FaMicrophone />
            </button>
          </div>

          {/* right */}
          <div className="flex items-center gap-3">
            {userData?.channel && (
              <button
                className="hidden md:flex items-center gap-1 bg-[#272727] py-1 px-3 rounded-full  cursor-pointer"
                onClick={() => navigate("/create")}
              >
                <span className="text-lg ">+</span>
                <span>Create</span>
              </button>
            )}
            {!userData?.photoUrl ? (
              <FaUserCircle
                className="text-3xl hidden md:flex text-gray-400"
                onClick={() => setPopup((prev) => !prev)}
              />
            ) : (
              <img
                src={userData?.photoUrl}
                className="w-9 h-9 rounded-full  object-cover border border-gray-700 hidden md:flex "
                onClick={() => setPopup((prev) => !prev)}
              ></img>
            )}
            <FaSearch className="text-lg md:hidden flex" />
          </div>
        </div>
      </header>

      {/* sideBar */}
      <aside
        className={`bg-[#0f0f0f] border-r border-gray-800 transition-all duration-300 fixed top-15 bottom-0 z-40 ${sideBarOpen ? "w-40" : "w-20"} hidden md:flex flex-col overflow-y-auto`}
      >
        <nav className="space-y-1 mt-3">
          <SideBarItem
            icon={<FaHome />}
            text={"Home"}
            open={sideBarOpen}
            selected={selectedItem === "Home"}
            onClick={() => {
              (setSelectedItem("Home"), navigate("/"));
            }}
          />

          <SideBarItem
            icon={<SiYoutubeshorts />}
            text={"Shorts"}
            open={sideBarOpen}
            selected={selectedItem === "Shorts"}
            onClick={() => {
              (setSelectedItem("Shorts"), navigate("/shorts"));
            }}
          />

          <SideBarItem
            icon={<MdOutlineSubscriptions />}
            text={"Subscriptions"}
            open={sideBarOpen}
            selected={selectedItem === "Subscriptions"}
            onClick={() => setSelectedItem("Subscriptions")}
          />
        </nav>
        <hr className="border-gray-800 my-3" />

        {sideBarOpen && <p className="text-sm text-gray-400 px-2">You</p>}
        <nav className="space-y-1 mt-3">
          <SideBarItem
            icon={<FaHistory />}
            text={"History"}
            open={sideBarOpen}
            selected={selectedItem === "History"}
            onClick={() => setSelectedItem("History")}
          />

          <SideBarItem
            icon={<FaList />}
            text={"Playlists"}
            open={sideBarOpen}
            selected={selectedItem === "Playlists"}
            onClick={() => setSelectedItem("Playlists")}
          />

          <SideBarItem
            icon={<GoVideo />}
            text={"Save videos"}
            open={sideBarOpen}
            selected={selectedItem === "Save videos"}
            onClick={() => setSelectedItem("Save videos")}
          />

          <SideBarItem
            icon={<FaThumbsUp />}
            text={"Like videos"}
            open={sideBarOpen}
            selected={selectedItem === "Like videos"}
            onClick={() => setSelectedItem("Like videos")}
          />
        </nav>

        <hr className="border-gray-800 my-3" />
        {sideBarOpen && (
          <p className="text-sm text-gray-400 px-2">Subscription</p>
        )}
      </aside>

      {/* MainArea */}
      <main
        className={`overflow-y-auto p-4 flex flex-col pb-16 transition-all duration-300 ${sideBarOpen ? "md:ml-60" : "md:ml-20"}`}
      >
        {location.pathname === "/" && (
          <>
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pt-2 mt-15">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  className="whitespace-nowrap bg-[#272727] px-4 py-1 rounded-lg text-sm hover:bg-gray-700"
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <AllVideosPage />
              <AllShortsPage />
            </div>
          </>
        )}
        {popup && <Profile />}
        <div className="mt-2">
          <Outlet />
        </div>
      </main>

      {/* bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 flex justify-around py-2 z-10">
        <MobileSizeNav
          icon={<FaHome />}
          text={"Home"}
          active={active === "Home"}
          onClick={() => {
            setActive("Home");
            navigate("/");
          }}
        />

        <MobileSizeNav
          icon={<SiYoutubeshorts />}
          text={"Shorts"}
          active={active === "Shorts"}
          onClick={() => setActive("Shorts")}
        />

        <MobileSizeNav
          icon={<IoIosAddCircle size={40} />}
          active={active === "+"}
          onClick={() => {
            (setActive("+"), navigate("/create"));
          }}
        />

        <MobileSizeNav
          icon={<MdOutlineSubscriptions />}
          text={"Subscriptions"}
          active={active === "Subscriptions"}
          onClick={() => setActive("Subscriptions")}
        />

        <MobileSizeNav
          icon={
            !userData?.photoUrl ? (
              <FaUserCircle />
            ) : (
              <img
                src={userData.photoUrl}
                className="w-8 h-8 rounded-full object-cover border border-gray-700"
              />
            )
          }
          text={"You"}
          active={active === "You"}
          onClick={() => {
            setActive("You");
            navigate("/mobileprofile");
          }}
        />
      </nav>
    </div>
  );
}

function SideBarItem({ icon, text, open, selected, onClick }) {
  return (
    <button
      className={`flex items-center gap-4 p-2 rounded w-full transition-colors ${open ? "justify-start" : "justify-center"} ${selected ? "bg-[#272727]" : "hover:bg-[#272727]"}`}
      onClick={onClick}
    >
      <span className="text-lg">{icon}</span>
      {open && <span className="text-sm">{text}</span>}
    </button>
  );
}

function MobileSizeNav({ icon, text, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 px-3  py-2 rounded-lg transition-all duration-300 ${active ? "text-white" : "text-gray-400"} hover:scale-105`}
    >
      <span className="text-2xl">{icon}</span>
      {text && <span className="text-xs">{text}</span>}
    </button>
  );
}

export default Home;
