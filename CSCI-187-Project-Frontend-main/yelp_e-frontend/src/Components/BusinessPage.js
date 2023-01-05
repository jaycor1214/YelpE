import { useContext, useEffect, useState } from "react";
import { stateContext } from "../Resources/GlobalState";
import "./Styling/BusinessPage.css";
import {
  BusinessReviewRequest,
  BusinessFilteredReviewRequest,
  GetGraphData,
  SingleBusinessRequest, 
} from "../Resources/Requests";
import StarRatings from "react-star-ratings";
import ReviewCard from "../Resources/ReviewCard";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { Button, InputGroup, Input } from "reactstrap";
import {
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { useParams } from 'react-router-dom';

const BusinessPage = () => {

  let {business_id} = useParams()

  //Set Up Global State
  const [globalState, setGlobalState] = useContext(stateContext);

  //Local State Data for Graph
  const [data, setdata] = useState([]);

  //setup react router navigate
  const navigate = useNavigate();

  //Review Search Bar Variabeles and setter
  var searchText = "";
  const setsearchText = (text) => {
    searchText = text;
  };

  //Get Reviews for the current businesses
  const getReviews = async () => {
    
     //set Loading Flag (for spinny wheel)
     await setGlobalState({ ...globalState, ReviewsIsLoading: true });

     //wait for API to return
     var results3 = await BusinessReviewRequest(
       business_id
     );
 
     //once api returns set global variables
     await setGlobalState({
       ...globalState,
       Reviews: results3,
       ReviewsIsLoading: false,
     });
  };



  //Loads all page data from API
  const loadPage = async () =>{
  
    var results = await SingleBusinessRequest(business_id);
   
    //if role is business owner of this business
    //get graph data
    if (
      globalState.Role == 1 &&
      globalState.Login[0].business_id ==
        globalState.CurrentBusiness[0].business_id
    ) {
      let results2 = await GetGraphData(globalState.Login[0].business_id);

      //set local data variable
      setdata(results2.reverse());
    }
    //get reviews no matter what
    console.log(globalState)

    //set Loading Flag (for spinny wheel)
    await setGlobalState({ ...globalState, ReviewsIsLoading: true });

    //wait for API to return
    var results3 = await BusinessReviewRequest(
      business_id
    );

    //once api returns set global variables
    await setGlobalState({
      ...globalState,
      CurrentBusiness: results,
      Reviews: results3,
      ReviewsIsLoading: false,
    });
  }
  //Function to Format Business Hours
  const getBusinessHours = () => {
    let output = [];

    console.log(globalState.CurrentBusiness);
    if (globalState.CurrentBusiness[0]["hours"] === null) {
      return <div style={{ fontSize: ".5em" }}>None Provided</div>;
    }

    var hours = globalState.CurrentBusiness[0]["hours"];

    const normalDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    let newHours = {};

    //Check if All normal days are there if not business is closed
    for (let i = 0; i < normalDays.length; i++) {
      if (hours[normalDays[i]]) {
        newHours[normalDays[i]] = convertTime(hours[normalDays[i]]);
      } else {
        newHours[normalDays[i]] = "Closed";
      }
    }

    //Create Divs
    for (let key in newHours) {
      output.push(
        <div className="businessHoursHours">
          {key + " "}
          {newHours[key]}
        </div>
      );
    }

    return output;
  };

  function convertTime(inutTimeStr) {
    if (typeof inutTimeStr == "string") {
      //split opening and closing Hours
      let splitedTime = inutTimeStr.split("-");
      for (let y = 0; y < splitedTime.length; y++) {
        //Split into Hours and minutes
        let splitedHours = splitedTime[y].split(":");

        // formatting hours
        if (splitedHours[0] > 12) {
          splitedHours[0] = splitedHours[0] - 12;
          // formatting minutes
          if (splitedHours[1].length == 1) {
            splitedHours[1] += "0pm";
          }
        } else {
          if (splitedHours[0] == 0) {
            splitedHours[0] = 12;
          }
          // formatting minutes
          if (splitedHours[1].length == 1) {
            splitedHours[1] += "0am";
          } else {
            splitedHours[1] += "am";
          }
        }

        splitedTime[y] = splitedHours.join(":");
      }

      return splitedTime.join("-");
    }
  }

  

  //On first load
  useEffect(() => {
    setGlobalState({ ...globalState, Search: [] });
    loadPage()
    
    return () => {};
  }, []);

  //reload page if reviews are updated
  useEffect(() => {
    return () => {};
  }, [globalState.reviews]);

  //create list of review card components
  const getReviewCards = () => {
    if (globalState.Reviews.length != 0) {
      return globalState.Reviews.map((x) => (
        <ReviewCard
          key={x.review_id}
          name={x.user_id}
          date={x.date}
          stars={x.stars}
          text={x.text}
        />
      ));
    } else {
      return <div key={1}>No Reviews</div>;
    }
  };

  const executeReviewSearch = async () => {
    //Set Loading Flag
    setGlobalState({ ...globalState, ReviewsIsLoading: true });
    //If search then execute API call
    if (searchText) {
      var result = await BusinessFilteredReviewRequest(
        globalState.CurrentBusiness[0]["business_id"],
        searchText
      );
      setGlobalState({
        ...globalState,
        Reviews: result,
        ReviewsIsLoading: false,
      });
    } else {
      setGlobalState({ ...globalState, ReviewsIsLoading: false });
    }
  };

  return (
    <div className="appPage">
      {/* 
            Top Information Section
        */}
      <div className="topSection">
        {globalState.CurrentBusiness.length > 0 && <div className="topParent">
          <div className="yelp_e_return" onClick={() => navigate("/")}>
            Yelp_E
          </div>
          <div className="businessHours">
            Hours:
            {getBusinessHours()}
          </div>
          <div className="businessPageName">
            {globalState.CurrentBusiness[0]["name"]}
          </div>
          <div className="ratings">
            <div className="avgRating">
              <StarRatings
                rating={globalState.CurrentBusiness[0]["stars"]}
                starRatedColor="red"
                numberOfStars={5}
                starDimension={"5vh"}
                starSpacing="3px"
              />
            </div>

            <div className="recentRS">
              {globalState.CurrentBusiness[0]["recent_review_score"] === -1.0
                ? "Not enough reviews"
                : "Recent Review Score: " +
                  globalState.CurrentBusiness[0]["recent_review_score"].toFixed(
                    1
                  ) +
                  "   (" +
                  globalState.CurrentBusiness[0]["review_count"] +
                  ")"}
            </div>
          </div>
        </div>}
      </div>

      {/* 
        Review Search Bar
        */}

      <div className="reviewSearchContainer">
        <div className="reviewBar">
          {searchText == "" ? (
            <div
              className="clearSearch"
              onClick={() => {
                setsearchText("");
                getReviews();
              }}
            >
              Clear
            </div>
          ) : (
            ""
          )}
          <div className="reviewSearchBar">
            <InputGroup size="sm">
              <Input
                placeholder="Search Reviews"
                onChange={(e) => setsearchText(e.target.value)}
              />

              <Button
                style={{ backgroundColor: "#eb5b5b" }}
                onClick={() => {
                  executeReviewSearch();
                }}
              >
                Search
              </Button>
            </InputGroup>
          </div>
          <div className="preselectedSearchContainer">
            <div
              className="preselectedSearch"
              onClick={() => {
                setsearchText("service");
                executeReviewSearch();
              }}
            >
              Service
            </div>
            <div
              className="preselectedSearch"
              onClick={() => {
                setsearchText("wait");
                executeReviewSearch();
              }}
            >
              Wait
            </div>
            <div
              className="preselectedSearch"
              onClick={() => {
                setsearchText("menu");
                executeReviewSearch();
              }}
            >
              Menu
            </div>
          </div>
        </div>
      </div>
      {/* 
        Lower Page
        -Reviews
        -Optionally: Graph
        */}
      <div className="LowerPage">
        {
          <div className="reviews">
            {globalState.ReviewsIsLoading ? (
              <CircularProgress></CircularProgress>
            ) : (
              getReviewCards()
            )}
          </div>
        }
        {/* 
        If Roles are good then display graph
        */}
        {globalState.Role == 1 &&
          globalState.Login[0].business_id ==
            globalState.CurrentBusiness[0].business_id && (
            <div className="chartContainer">
              <ResponsiveContainer height="100%" width="100%">
                <LineChart ti data={data}>
                  <CartesianGrid
                    fill="#eee"
                    vertical={false}
                    horizontal={false}
                  />
                  <Tooltip wrapperStyle={{ fontSize: "20px" }} />
                  <XAxis
                    fontSize=".5em"
                    tick={false}
                    dataKey="date"
                    label={{
                      value: "Recent Review Score",
                      fontSize: ".5em",
                      fill: "#666",
                    }}
                  />
                  <YAxis
                    fontSize=".5em"
                    domain={["dataMin-1", 5]}
                    tickLine={false}
                    tickCount={3}
                  />
                  {data.length > 0 && (
                    <Line
                      type="monotone"
                      dataKey="rrs"
                      stroke={
                        data[0].rrs > data[data.length - 1].rrs
                          ? "#eb5b5b"
                          : "#25cf26"
                      }
                      strokeWidth="2px"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
      </div>
    </div>
  );
};

export default BusinessPage;
