from flask import Flask
from flask import jsonify, request
from bson.json_util import dumps
import json
import pymongo
from pymongo import MongoClient
import certifi
import math

ca = certifi.where()
cluster = MongoClient("mongodb+srv://yelpe_dev:yelpe_dev@yelpe.jilnd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",tlsCAFile=ca)

db = cluster["yelpDB"]




app = Flask(__name__)


app.secret_key = "secretkey"

@app.route("/users/login/<username>/<password>", methods=['GET'])
def login(username, password):
    collection = db["users"]   
    results = collection.find({"username":username, "password":password})
    
    return dumps(results)


@app.route('/businesses/searchbar/<business_id>/<searchString>', methods=['GET'])
def get_searchBar(business_id,searchString):
    reviewArr = []
    collection = db["newReviews"]
    results = collection.find({"business_id":business_id}).sort("date",-1)
    for result in results:
        if(searchString in result["text"]):
            reviewArr.append(result)
    #results_json = eval(results_str)

    return dumps(reviewArr)

@app.route('/search/<search>/<sort>', methods=['GET'])
def get_businesses(search,sort):
    collection = db["businesses"]
    regex = '.*'+ search +'.*'
    results_cur = collection.find({"$or":[{"name":{'$regex':regex}},{"categories":{'$regex':regex}},{"city":{'$regex':regex}}]}).sort(sort, -1)
    results_str= dumps(results_cur)
    #results_json = eval(results_str)
   
    return( results_str)



# TODO: refactor w/ ReviewScoreScript.py
@app.route('/businesses/owner/<business_id>/graph', methods=['GET'])
def get_rrsArrayById(business_id):
    RRS_COUNT = 10
    
    # EMA constants
    SMOOTHING = 3 # larger value = more weight on more recent reviews

    MIN_REVIEW_COUNT_FOR_RRS = 10
    PERIOD_PERCENTAGE = .2
    MIN_REVIEW_COUNT = MIN_REVIEW_COUNT_FOR_RRS / PERIOD_PERCENTAGE

    rrs_arr = []
    collection = db["newReviews"]

    # calculate review count
    reviews = list(collection.find({"business_id":business_id}))
    review_count = len(reviews)
    
    if (review_count < MIN_REVIEW_COUNT):

        return rrs_arr # not enough reviews for rrs


    # calculate rrs_arr
    reviews.sort(key=(lambda x: x["date"]))


    for offset in range(0, RRS_COUNT):
        period = math.floor(review_count * PERIOD_PERCENTAGE)
        start = len(reviews) - period - offset
        if (review_count < MIN_REVIEW_COUNT or start < 0 or period == 0):
            break # not enough reviews for rrs


        # calculate rrs
        first_time = True
        prev_ema = 0
        ema_score = 0

        ema_constant = SMOOTHING / (1 + period)


        for j in range(0, period):
            review = reviews[start + j]
            if(first_time):

                ema_score = review["stars"] # use SMA for base
                first_time = False
            else:
                ema_score = (review["stars"] * ema_constant) + (prev_ema*(1-ema_constant))
            prev_ema = ema_score
        rrs_arr.append({"date": review["date"], "rrs": round(ema_score,2)})

        review_count -= 1
    return(dumps(rrs_arr))

@app.route('/business/<id>', methods=['GET'])
def get_business(id):

    print(id)
    collection = db["businesses"]
    results_cur = collection.find({"business_id": id})
    results_str= dumps(results_cur)
    print(results_str)
    #results_json = eval(results_str)
   
    return( results_str)

@app.route('/businesses/reviews/<id>', methods=['GET'])
def get_businessReviews(id):
    collection = db["newReviews"]
    results_cur = collection.find({"business_id":id}).sort("date", -1)
    results_str= dumps(results_cur)
    #results_json = eval(results_str)
   
    return( results_str)

@app.errorhandler(404)
def not_found(error=None):
    message={
        'status':404,
        'message':'Not Found' + request.url
    }
    resp = jsonify(message)

    resp.status_code = 404

    return resp


if __name__ == "__main__":
    app.run(debug=True)
