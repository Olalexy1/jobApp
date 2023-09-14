import ScreenHeaderBtn from "./common/header/ScreenHeaderBtn";
import ScreenHeader from "./common/header/ScreenHeader";
import AvatarBtn from "./common/avatar/avatar";

// home screen
import Welcome from "./home/welcome/Welcome";
import NearByJobs from "./home/nearby/Nearbyjobs";
import PopularJobs from "./home/popular/Popularjobs";
import LikedJobs from "./liked/likedJobs";

// job details screen
import Company from "./jobdetails/company/Company";
import { default as JobTabs } from "./jobdetails/tabs/Tabs";
import { default as JobAbout } from "./jobdetails/about/About";
import { default as JobFooter } from "./jobdetails/footer/Footer";
import Specifics from "./jobdetails/specifics/Specifics";

// common
import NearbyJobCard from "./common/cards/nearby/NearbyJobCard";
import LikedJobCard from "./common/cards/liked/likedJobsCard";

export {
  ScreenHeaderBtn,
  Welcome,
  NearByJobs,
  PopularJobs,
  Company,
  JobTabs,
  JobAbout,
  JobFooter,
  Specifics,
  NearbyJobCard,
  AvatarBtn,
  LikedJobCard,
  LikedJobs,
  ScreenHeader
};
