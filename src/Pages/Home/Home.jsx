import React, { useState } from "react";
import Banner from "../Banner/Banner";
import ContestSection from "../Banner/ContestSection";
import WinnerAdvertisement from "../Banner/WinnerAdvertisement";
import ExtraSection from "../Banner/ExtraSection";

const Home = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <>
      <Banner searchText={searchText} setSearchText={setSearchText} />
      <ContestSection searchText={searchText} />
      <WinnerAdvertisement></WinnerAdvertisement>
      <ExtraSection></ExtraSection>
    </>
  );
};

export default Home;
