using System;
using System.Collections.Generic;

namespace CoreModel.Model
{
    public partial class Customers
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public bool? Active { get; set; }
    }
}
