using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ServiceStack.Redis;
using System.Configuration;
using Newtonsoft.Json.Linq;

namespace SignalGrr
{
    public class RedisDataLayer: IDataLayer
    {
        RedisClient client
        {
            get
            {
                return new RedisClient(
                    ConfigurationManager.AppSettings["Redis2GoHost"].ToString()
                    , Convert.ToInt32(ConfigurationManager.AppSettings["Redis2GoPort"])
                    , ConfigurationManager.AppSettings["Redis2GoPassword"].ToString()
                );
            }
        }

        public dynamic Get(dynamic lookup)
        {
            var _json = client.Get<string>(String.Concat(lookup.applicationId, "-", lookup.pageId));
            var _model = JObject.Parse(_json);
            return _model;
        }

        public bool Save(dynamic lookup, string model)
        {
            string _key = String.Concat(lookup.applicationId, "-", lookup.pageId);
            return client.Set<string>(_key, model);
        }

        public bool Delete(dynamic lookup)
        {
            return client.Remove(String.Concat(lookup.applicationId, "-", lookup.pageId));
        }
    }
}