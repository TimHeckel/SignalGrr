using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MongoDB.Driver;
using System.Configuration;
using MongoDB.Bson;

namespace SignalGrr
{
    public class MongoDataLayer: IDataLayer
    {
        MongoDatabase _db
        {
            get
            {
                var _server = MongoServer.Create(ConfigurationManager.AppSettings["MongoHost"]);
                return _server.GetDatabase(ConfigurationManager.AppSettings["MongoDB"]);
            }
        }

        public dynamic Get(dynamic lookup)
        {
            var _coll = _db.GetCollection(lookup.collection);
            return _coll.GetItems<dynamic>(lookup.query, lookup.orderBy);
        }

        public bool Save(dynamic lookup, string dataModel)
        {
            MongoCollection _coll = _db.GetCollection(lookup.collection);
            var res = _coll.Save(new BsonDocument().FromJson(dataModel));
            return res.Ok;
        }

        public bool Delete(dynamic lookup)
        {
            var _qs = lookup.query as string;
            var _query = new QueryDocument(new BsonDocument().FromJson(_qs));
             var _coll = _db.GetCollection(lookup.collection);
            var res = _coll.Remove(_query);
            return res.Ok;
        }

    }
}