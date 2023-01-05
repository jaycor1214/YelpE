from math import fabs
import pymongo
from pymongo import MongoClient
import certifi
from bson.json_util import dumps

ca = certifi.where()
online_cluster = MongoClient("mongodb+srv://yelpe_dev:yelpe_dev@yelpe.jilnd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",tlsCAFile=ca)
online_db = online_cluster["yelpDB"]
online_businessCollection = online_db["businesses"]



local_cluster = MongoClient("mongodb://localhost:27017/")
local_db = local_cluster["test"]
local_reviewCollection = local_db["reviews"]
local_reviewCutCollection = local_db["reviewsCut"]
local_businessCollection = local_db["businesses"]



online_businesses = online_businessCollection.find()
local_businesses = local_businessCollection.find()
test = local_reviewCutCollection.find()
print(test.count())


count = 0
output=[]
for business in online_businesses:
    
    output.append(business["business_id"])

#print(output)

hello =local_reviewCollection.find({"business_id":{"$in":output}})


#local_reviewCutCollection.insert_many(hello)
   