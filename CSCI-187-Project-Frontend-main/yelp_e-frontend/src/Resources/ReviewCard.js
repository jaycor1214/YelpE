import "./Styling/ReviewCard.css"
import { useContext } from "react"
import StarRatings from 'react-star-ratings';
import {stateContext} from "../Resources/GlobalState"


const ReviewCard = (props) =>{
    //Setup GlobalState
    const [globalState,setGlobalState]  = useContext(stateContext)
    
    return(
        
        <div className="reviewCard" style={(globalState.Role===1 && globalState.Login[0].business_id ===globalState.CurrentBusiness[0].business_id)? {width:"60vw"}:{width:"90vw"}}>
             {/* Review Information */}
            <div className="userInfo">
                
                <div className="reviewDate">
                    {props.date}
                </div>
                <div className="stars">
                    <StarRatings 
                        rating={props.stars} 
                        starRatedColor="red" 
                        numberOfStars={5} 
                        starDimension={"3vh"} 
                        starSpacing="1px"
                    />
                </div>
            </div>
            {/* Review Body */}
            <div className="reviewText">
                {props.text}
            </div>
        </div>


    )
}


export default ReviewCard