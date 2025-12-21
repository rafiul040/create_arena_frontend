import React, { useState } from "react";
import Banner from "../Banner/Banner";
import ContestSection from "../Banner/ContestSection";

const Home = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <>
      <Banner searchText={searchText} setSearchText={setSearchText} />
      <ContestSection searchText={searchText} />
    </>
  );
};

export default Home;
