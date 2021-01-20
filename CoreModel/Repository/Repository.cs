using BaseRepository;
using System;
using System.Collections.Generic;
using System.Text;

namespace CoreModel.Repository
{
    public class Repository<T> :abstarctFactory<T> where T:class
    {
        public Repository():base("")
        {

        }
    }
}
