const LeadsTotal = require("../models/LeadUndeduped");
const connectDB = require("../config/db");
(

    async()=>{
      await  connectDB()

    //   realdupes = await LeadsTotal.countDocuments({
    //       $and:[{
    //           phone: "16783422449",
    //           user: "5e32c64cdd69d2999c5fff15"
    //       }]
    //   })


    //   console.log(realdupes)
        const  realdupes =   await LeadsTotal.aggregate([
            {
    
            $group: {
                // collect ids of the documents, that have same value 
                // for a given key ('val' prop in this case)
            // _id: null,
            _id: { phone: "$phone", user: "$user"},
            docs: { $push: "$leadgroup" },        
            count: { $sum:  1 },
              }
            },
            {
              $match: {
    
                // match only documents with duplicated value in a key
                count: { $gt : 1 },
                docs: {"$in": ["610d5b9628c81ab3a39cb457"]}
    
              },
            },
            // {
            //     $project: {
            //       _id: false,
            //       count: '$count',
            //     }
            //   },

          
        
          ]);

          console.log(realdupes, "value")
    }
)()