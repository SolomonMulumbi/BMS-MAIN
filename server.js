const express=require("express");
const cors=require("cors");

const app=express();
app.use(cors());

let latestCBC=null;

// Called from your decoder
global.saveCBC=(result)=>{
    latestCBC=result;
};

// KEAH requests this endpoint
app.get("/cbc-read",(req,res)=>{

    if(!latestCBC){

        return res.json({
            success:false,
            message:"Waiting for BC-2800..."
        });

    }

    const result=latestCBC;

    latestCBC=null;

    res.json({
        success:true,
        result
    });

});

app.listen(3000,()=>{
    console.log("BMS CBC Bridge Running");
});