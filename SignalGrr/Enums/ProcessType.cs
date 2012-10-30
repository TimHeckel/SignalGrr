using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SignalGrr.Enums
{
    public enum ProcessType
    { 
        None
        ,Save
        ,Delete
    }

    public static class Extensions
    {
        public static string ToString(this ProcessType e)
        {
            switch (e)
            {
                case ProcessType.Save:

                    return "SAVE";
                case ProcessType.Delete:
                    return "DELETE";
                default:
                    return "";
            }
        }
    }
}