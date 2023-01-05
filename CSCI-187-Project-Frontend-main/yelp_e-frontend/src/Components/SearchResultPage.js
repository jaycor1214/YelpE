import {
  Button,
  InputGroup,
  Input,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import "./Styling/SearchResultPage.css";
import BusinessCard from "../Resources/BusinessCard";
import { SearchRequest } from "../Resources/Requests";
import { useState, useContext, useEffect } from "react";
import { stateContext } from "../Resources/GlobalState";
const SearchPage = () => {
  //Set Up Global State
  const [globalState, setGlobalState] = useContext(stateContext);

  //Set up Local sort variable
  const [sort, setsort] = useState("recent_review_score");

  //set up local resultCount Variables
  //This is how many results are being shown (default 50)
  const [resultCount, setresultCount] = useState(50);

  //On First load clear currentbusiness
  useEffect(() => {
    setGlobalState({ ...globalState, CurrentBusiness: [] });

    return () => {};
  }, []);

  //On search change reload page
  useEffect(() => {
    setGlobalState({ ...globalState });

    return () => {};
  }, [globalState.Search, globalState.SearchIsLoading]);

  //on sort change reload page
  useEffect(() => {
    executeSearchRequest();

    return () => {};
  }, [sort]);

  //Sort Dropdown variable
  const [toggleSortButton, settoggleSortButton] = useState(false);

  //Handle Scroll, if hits bottom load more results
  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    console.log(bottom);
    if (bottom) {
      setresultCount(resultCount + 50);
    }
  };

  //Execute Search API request
  const executeSearchRequest = async () => {
    console.log(globalState.SearchRequest);
    if (globalState.SearchRequest === undefined) {
      return;
    }

    setGlobalState({ ...globalState, SearchIsLoading: true });

    var results = await SearchRequest(globalState.SearchRequest, sort);
    setGlobalState({ ...globalState, Search: results });

    setGlobalState({ ...globalState, SearchIsLoading: false });
  };

  //Handle Enter press on search bar
  const keyDownEvent = (e) => {
    if (e.key === "Enter") {
      setGlobalState({ ...globalState, Search: [] });
      executeSearchRequest();
    }
  };

  //Get the array of componnets of BusinessCards
  const getbusinessCards = () => {
    let output = [];
    if (globalState.Search.length === 0) {
      return <div>No Results</div>;
    }

    //Get amount dynamically so not loading thousands
    if (resultCount < globalState.Search.length) {
      for (let i = 0; i < resultCount; i++) {
        output.push(
          <BusinessCard
            key={i}
            name={globalState.Search[i]["name"]}
            rating={globalState.Search[i]["stars"]}
            city={globalState.Search[i]["city"]}
            state={globalState.Search[i]["state"]}
            address={globalState.Search[i]["address"]}
            rrs={globalState.Search[i]["recent_review_score"]}
            business_id={globalState.Search[i]["business_id"]}
            totalreviews={globalState.Search[i]["review_count"]}
          />
        );
      }
    } else {
      for (let i = 0; i < globalState.Search.length; i++) {
        output.push(
          <BusinessCard
            key={i}
            name={globalState.Search[i]["name"]}
            rating={globalState.Search[i]["stars"]}
            city={globalState.Search[i]["city"]}
            state={globalState.Search[i]["state"]}
            address={globalState.Search[i]["address"]}
            rrs={globalState.Search[i]["recent_review_score"]}
            business_id={globalState.Search[i]["business_id"]}
            totalreviews={globalState.Search[i]["review_count"]}
          />
        );
      }
    }

    return output;
  };

  //Setup React Router Navigate
  const navigate = useNavigate();

  return (
    <div className="appPage" onScroll={(e) => handleScroll(e)}>
      {/*
            Top Search Bar
             */}
      <div className="topBar">
        <div className="topParent">
          {/*
            Yelp_e Logo
             */}
          <div className="yelp_e_return_result" onClick={() => navigate("/")}>
            Yelp_E
          </div>

          {/*
            top search
             */}
          <div className="topFlex">
            <div className="topSearch">
              <InputGroup size="lg">
                <Input
                  placeholder="Search (Name, Category, City)"
                  onChange={(e) =>
                    setGlobalState({
                      ...globalState,
                      SearchRequest: e.target.value,
                    })
                  }
                  onKeyDown={keyDownEvent}
                />

                <Button
                  onClick={() => {
                    executeSearchRequest();
                  }}
                >
                  Search
                </Button>
              </InputGroup>
            </div>
          </div>

          {/*
            Top sort
             */}
          <Dropdown
            isOpen={toggleSortButton}
            toggle={() => settoggleSortButton(!toggleSortButton)}
            className="sortDropdown"
            size="sm"
            direction="left"
          >
            <DropdownToggle>
              {sort == "stars"
                ? "Sort: Average Rating"
                : "Sort: Recent Review Score"}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => setsort("recent_review_score")}>
                Recent Review Score
              </DropdownItem>
              <DropdownItem onClick={() => setsort("stars")}>
                Average Reviews
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/*
            Results display
             */}
      <div className="resultDisplay">
        {globalState.SearchIsLoading ? (
          <CircularProgress />
        ) : (
          getbusinessCards()
        )}
      </div>
    </div>
  );
};

export default SearchPage;
