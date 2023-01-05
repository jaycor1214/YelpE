import pymongo
from pymongo import MongoClient

cluster = MongoClient("mongodb+srv://yelpe_dev:yelpe_dev@yelpe.jilnd.mongodb.net/Yelpe?retryWrites=true&w=majority")
db = cluster["yelpDB"]
businessCollection = db["businesses"]
reviewCollection = db["newReviews"]

business = businessCollection.find()

for result in business:
    busId = result["business_id"]
    reviews = reviewCollection.find({"business_id": busId})
    count = 0
    for review in reviews:
       if(result["business_id"] == review["business_id"]):
           count+= 1
           break
    if(count == 0):
        businessCollection.remove(result)