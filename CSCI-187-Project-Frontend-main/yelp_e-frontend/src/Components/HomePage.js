import "./Styling/HomePage.css";

import {
  Button,
  InputGroup,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { SingleBusinessRequest, LoginRequest } from "../Resources/Requests";
import { useState, useContext, useEffect } from "react";
import { stateContext } from "../Resources/GlobalState";

const HomePage = () => {
  //Set Up Global State
  const [globalState, setGlobalState] = useContext(stateContext);

  //Initialize Local State Variables
  const [searchName, setsearchName] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

  //Modal toggling variables
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  //React Router Navigate Function
  const navigate = useNavigate();

  //Initial Load Use Effect
  //clear search if brought back to homepage
  useEffect(() => {
    setGlobalState({ ...globalState, Search: [] });
    return () => {};
  }, []);

  //Save the search query and navigate to search page
  const executeSearch = async () => {
    await setGlobalState({ ...globalState, SearchRequest: searchName });
    navigate("/search");
  };

  //Execture Login Query
  //and if successful save login information in global state
  const executeLogin = async () => {
    var results = await LoginRequest(username, password);
    if (results.length == 1) {
      toggle();
      setGlobalState({ ...globalState, Login: results, Role: results[0].role });
    }
  };

  //Handles the enter press on search bar
  const handlekeyDownEvent = (e) => {
    if (e.key === "Enter") {
      executeSearch();
    }
  };

  //If logged in:
  //Get business information for owners business
  //Navigate to that page
  const navigateToMybusiness = async () => {
    var results = await SingleBusinessRequest(globalState.Login[0].business_id);
    await setGlobalState({
      ...globalState,
      CurrentBusiness: results,
      Reviews: [],
    });

    navigate(`/business/${globalState.Login[0].business_id}`);
  };

  return (
    <div className="appHomePage">
      {/* 
            Login Modal Component
        */}
      <Modal isOpen={modal} toggle={toggle} modalTransition={{ timeout: 1000 }}>
        <ModalHeader charcode="Y" toggle={toggle}>
          Login
        </ModalHeader>
        <ModalBody>
          <Input
            className="loginField"
            placeholder="Username"
            onChange={(e) => setusername(e.target.value)}
          />
          <Input
            type="password"
            className="loginField"
            placeholder="Password"
            onChange={(e) => setpassword(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button style={{ backgroundColor: "#eb5b5b" }} onClick={executeLogin}>
            Login
          </Button>
          <Button onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
      {/* 
            Buttons on top right components
        */}
      <div className="topRightContainer">
        <div className="topRightButtons">
          {globalState.Role === 1 && (
            <Button onClick={navigateToMybusiness}>My business</Button>
          )}
          {globalState.Login.length === 0 && (
            <Button style={{ backgroundColor: "#eb5b5b" }} onClick={toggle}>
              Login
            </Button>
          )}
          {globalState.Login.length > 0 && (
            <Button
              style={{ backgroundColor: "#eb5b5b" }}
              onClick={() =>
                setGlobalState({ ...globalState, Login: [], Role: -1 })
              }
            >
              Logout
            </Button>
          )}
        </div>
      </div>
      {/* 
            Center of Page Search
        */}
      <div className="centerSearch">
        <div className="yelp_e">Yelp_e</div>
        <InputGroup>
          <Input
            placeholder="Search (Name, Category, City)"
            onChange={(e) => setsearchName(e.target.value)}
            onKeyDown={handlekeyDownEvent}
          />
          <Button
            onClick={() => {
              executeSearch();
            }}
          >
            Search
          </Button>
        </InputGroup>
      </div>
    </div>
  );
};

export default HomePage;
