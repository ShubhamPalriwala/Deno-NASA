import * as log from "../deps.ts"
import * as _ from "../deps.ts";


interface Launch{
    flightNumber: number;
    mission: string;
    rocket:string;
    customers:Array<string>;
    launchDate:number;
    upcoming:boolean;
    success?:boolean;
    target?:boolean;
}

const launches=new Map<number, Launch>();

async function downloadLaunchData(){
    console.log("Downloading launch data");

    const response=await fetch("https://api.spacexdata.com/v3/launches",{
        method:"GET"
    });

    if(!response.ok){
        log.warning("Problem downloading launch data");
        throw new Error("Launch data download failed")
    }
    const launchData=await response.json();

    for(const launch of launchData){

        const payloads=launch["rocket"]["second_stage"]["payloads"];
        const customers=_.flatMap(payloads,(payload:any)=>{
            return payload["customers"];
        })


        const flightData={
            flightNumber:launch["flight_number"],
            mission:launch["mission_name"],
            rocket:launch["rocket"]["rocket_name"],
            launchDate:launch["launch_date_unix"],
            upcoming:launch["upcoming"],
            success:launch["launch_success"],
            customers
        };
        launches.set(flightData.flightNumber,flightData);

        console.log(JSON.stringify(flightData))
    }
}

await downloadLaunchData();
console.log(`Downloaded Data for ${launches.size} SpaceX Launches`)

export function getAll(){
    return Array.from(launches.values());
}

export function getOne(id:number){
    if(launches.has(id))
    {
        return launches.get(id);
    }
    return null
}

export function addOne(data:Launch) {
    launches.set(data.flightNumber,Object.assign(data,{
        upcoming:true,
        customers:["Yes, it's you","NASA"],
    }));
}

export function removeOne(id:number) {
    const aborted=launches.get(id);
    if(aborted)
    {
        aborted.upcoming=false;
        aborted.success=false;
    }
    return aborted
}
