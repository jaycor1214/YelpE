import pymongo
from pymongo import MongoClient

import certifi
import math

ca = certifi.where()
cluster = MongoClient("mongodb+srv://yelpe_dev:yelpe_dev@yelpe.jilnd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",tlsCAFile=ca)

db = cluster["yelpDB"]
business_collection = db["businesses"]
review_collection = db["newReviews"]

# EMA constants
SMOOTHING = 3 # larger value = more weight on more recent reviews
MIN_REVIEW_COUNT_FOR_RRS = 10
PERIOD_PERCENTAGE = .2
MIN_REVIEW_COUNT = MIN_REVIEW_COUNT_FOR_RRS / PERIOD_PERCENTAGE

# calculating RRS per business
business = business_collection.find()
for result in business:
    business_id = result["business_id"]

    # calculate review count
    sorted_reviews = list(review_collection.find({"business_id":business_id}).sort("date", 1))
    
    review_count = len(sorted_reviews)

    period = math.floor(review_count * PERIOD_PERCENTAGE)
    start = review_count - period

    # calculate RRS
    if (review_count >= MIN_REVIEW_COUNT):
        
        first_time = True
        prev_ema = 0
        ema_score = 0

        for j in range(0, period):
            review = sorted_reviews[start + j]
            if(first_time):
                ema_score = review["stars"]
                first_time = False
            else:
                ema_score = (review["stars"] * (SMOOTHING/(1+period))) + (prev_ema*(1-(SMOOTHING/(1+period))))
            prev_ema = ema_score
    else:
        ema_score = -1 # not enough reviews for RRS

    business_collection.update_one( { "business_id" : business_id }, { "$set":{ "recent_review_score" : ema_score } } )