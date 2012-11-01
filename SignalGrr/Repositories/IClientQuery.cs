using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SignalGrr
{
    public interface IClientQuery
    {
        dynamic Get(dynamic lookup);
    }
}
