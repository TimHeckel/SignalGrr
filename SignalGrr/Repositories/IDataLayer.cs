﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SignalGrr
{
    public interface IDataLayer
    {
        dynamic Get(dynamic lookup);
        bool Save(dynamic lookup, string dataModel);
        bool Delete(dynamic lookup);
    }
}
