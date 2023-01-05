import "./Styling/BusinessCard.css";
import { useNavigate } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { SingleBusinessRequest } from "./Requests";
import { useContext } from "react";
import { stateContext } from "./GlobalState";

const BusinessCard = (props) => {
  //Setup React Router Navigate
  const navigate = useNavigate();

  //Setup Global State
  const [globalState, setGlobalState] = useContext(stateContext);

  //Request the API for singleBusiness and go to Business Page
  const requestbusinessPage = async () => {
    navigate(`/business/${props.business_id}`);
  };

  return (
    <div className="businessCard" onClick={() => requestbusinessPage()}>
      {/*Left Picture*/}
      <div className="leftpicture"></div>
      {/*Business Details*/}
      <div className="middletext">
        <div className="businessName">{props.name}</div>
        <div className="businessRating">
          <StarRatings
            rating={props.rating}
            starRatedColor="red"
            numberOfStars={5}
            starDimension={"20px"}
            starSpacing="3px"
          />
          <div className="totalRatings">{"(" + props.totalreviews + ")"}</div>
        </div>
        <div className="businessAddress">{props.city + ", " + props.state}</div>
        <div className="businessAddress">{props.address}</div>
      </div>
      {/*Recent Review Score*/}
      <div className="rrcbox">
        <div className="rrc">
          <div className="rrcScore">
            {props.rrs === -1.0
              ? "Not enough reviews"
              : "Recent Review Score: " + props.rrs.toFixed(1)}
          </div>
          <div className="rrcTotal">{" (" + props.totalreviews + ")"}</div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
