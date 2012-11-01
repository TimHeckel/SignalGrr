using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MongoDB.Driver;
using MongoDB.Bson.Serialization;
using MongoDB.Bson;
using MongoDB.Driver.Builders;
using MongoDB.Driver.Wrappers;
using System.Collections;
using Newtonsoft.Json;

namespace SignalGrr
{
    public static class Data
    {

        //http://stackoverflow.com/questions/6120629/can-i-do-a-text-query-with-the-mongodb-c-sharp-driver
        public static List<T> GetItems<T>(this MongoCollection collection,
                        string queryString, string orderString) where T : class
        {
            var queryDoc = BsonSerializer.Deserialize<BsonDocument>(queryString);
            var orderDoc = BsonSerializer.Deserialize<BsonDocument>(orderString);

            var query = new QueryDocument(queryDoc);
            var order = new SortByWrapper(orderDoc);

            var cursor = collection.FindAs<T>(query);
            cursor.SetSortOrder(order);

            return cursor.ToList();
        }

        //http://codebetter.com/johnvpetersen/2011/03/03/a-simple-approach-to-hydrating-the-c-mongodb-driver-objects/
        public static BsonDocument FromJson(this BsonDocument document, string json)
        {
            var jsonObject = JsonConvert.DeserializeObject<Hashtable>(json);
            enumerate(jsonObject, document, null);

            return document;
        }

        static void enumerate(Object jsonObject, BsonDocument document, BsonArray array)
        {
            var hashtable = jsonObject as Hashtable;

            if (hashtable != null)
            {
                if (array != null)
                {
                    var newDocument = new BsonDocument();
                    array.Add(newDocument);
                }

                foreach (DictionaryEntry dictionaryEntry in hashtable)
                {
                    if (dictionaryEntry.Value.GetType() == typeof(Hashtable))
                    {
                        var newDocument = new BsonDocument();
                        if (array != null)
                        {
                            array.Add(newDocument);
                            newDocument.Add(dictionaryEntry.Key.ToString(), BsonValue.Create(dictionaryEntry.Value));
                        }
                        else
                            document.Add(dictionaryEntry.Key.ToString(), newDocument);

                        enumerate(dictionaryEntry.Value, newDocument, array);
                    }
                    else
                    {
                        if (dictionaryEntry.Value.GetType() == typeof(ArrayList))
                        {

                            var newArray = new BsonArray();
                            document.Add(dictionaryEntry.Key.ToString(), newArray);

                            foreach (object entry in dictionaryEntry.Value as ArrayList)
                                enumerate(entry, document, newArray);
                        }
                        else
                        {
                            if (array != null)
                            {
                                if (array.Count > 0 && array[array.Count - 1].GetType() == typeof(BsonDocument))
                                    ((BsonDocument)array[array.Count - 1]).Add(dictionaryEntry.Key.ToString(), BsonValue.Create(dictionaryEntry.Value));
                                else
                                    array.Add(BsonValue.Create(dictionaryEntry.Value));
                            }
                            else
                                document.Add(dictionaryEntry.Key.ToString(), BsonValue.Create(dictionaryEntry.Value));
                        }
                    }
                }
            }
            else
                if (array != null)
                    array.Add(BsonValue.Create(jsonObject));
        }
    }
}